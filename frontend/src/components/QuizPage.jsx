import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from '../context/UserContext';
import { getQuestionResult } from '../api/axiosInstance';
import TimerReset from "./TimerReset.jsx";

const QuizPage = () => {
    const { user } = useContext(UserContext);
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [resetKey, setResetKey] = useState(Date.now());
    const [timeTaken, setTimeTaken] = useState(0);
    const [timerActive, setTimerActive] = useState(true);

    const loadNextQuestion = async () => {
        setLoading(true);
        setFeedback("");
        setAnswer("");
        setTimerActive(true);
        setResetKey(Date.now());

        try {
            const res = await axios.post("http://localhost:55500/quiz", {
                difficulty: "하"
            });
            if (!res.data || !res.data.questionId) {
                setDone(true);
            } else {
                setQuestion(res.data);
            }
        } catch (e) {
            console.error("문제 불러오기 실패", e);
            setError("문제 불러오기 실패");
        } finally {
            setLoading(false);
        }
    };

    
    //문제풀이 결과 조회
    const handleResult = async (data) => {
        console.log('QuestionResult/handleResult');

        try {
            //서버전송
            let req  =  {
                "studentId": user?.studentId ?? 'hjoh' ,
                "questionId": data?.questionId ?? 'math_logic_4',
                "resultAnswer": data?.resultAnswer ?? '2970',
                "resultTimeSec": data?.resultTimeSec ?? '3',
            }


            const res = await getQuestionResult(req);
            let reply = res?.data?.payload?.body?.reply;
            console.log("서버 응답 reply 원문:", reply);

            let result = JSON.parse(reply);
           // setResult(JSON.parse(reply))
            setFeedback(result?.questions?.explanation || "피드백 없음");
        } catch (err) {
            console.error('문제풀이 결과 조회 실패:', err);
            alert('문제풀이 결과 조회 실패');
        }
    };

    useEffect(() => {
        (async () => {
            await loadNextQuestion();
        })();
    }, []);

    const submit = async () => {
        if (!question) return;

        setTimerActive(false); // 타이머 정지

        try {
            await handleResult({
                questionId: question.questionId,
                resultAnswer: answer,
                resultTimeSec: timeTaken,
            });
        } catch (e) {
            console.error("AI 피드백 실패", e);
            setFeedback("AI 피드백 실패");
        }
    };

    const quit = () => setDone(true);

    if (error) return <div>{error}</div>;
    if (done) return <div>문제 풀이를 종료했또로~</div>;
    if (loading || !question) return <div>문제 불러오는 중...</div>;

    return (
        <div style={{ padding: "1px", maxWidth: "600px", margin: "0 auto" }}>
            <TimerReset
                resetTrigger={resetKey}
                onTimeUpdate={setTimeTaken}
                active={timerActive}
            />

            <p><strong>문제:</strong> {question?.rewriteQuestion || question?.originalQuestion || "문제 없음"}</p>

            <div style={{ marginTop: "10px" }}>
                <label>정답입력: </label>
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    style={{ width: "80%" }}
                />
            </div>

            {!feedback && (
                <div style={{ marginTop: "10px" }}>
                    <button onClick={quit}>그만풀래</button>
                    <button onClick={submit} style={{ marginLeft: "10px" }}>제출</button>
                </div>
            )}

            {feedback && (
                <div style={{ marginTop: "20px" }}>
                    <p>{feedback}</p>
                    <button onClick={quit}>그만풀래</button>
                    <button onClick={loadNextQuestion} style={{ marginLeft: "10px" }}>다음 문제</button>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
