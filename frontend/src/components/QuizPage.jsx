import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from '../context/UserContext';
import { getQuestionResult } from '../api/axiosInstance';
import TimerReset from "./TimerReset.jsx";

const QuizPage = (props) => {
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

    const [submitted, setSubmitted] = useState(false);


    // 문제 불러오기 및 상위로 전달
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
                // csm 문제를 상위로 전달
                if (props.onQuestion) {
                    props.onQuestion(res.data.rewriteQuestion || res.data.originalQuestion);
                }
            }
        } catch (e) {
            console.error("문제 불러오기 실패", e);
            setError("문제 불러오기 실패");
        } finally {
            setLoading(false);
        }
    };

    // 문제풀이 결과 조회
    const handleResult = async (data) => {
        try {
            let req  =  {
                "studentId": user?.studentId ?? 'hjoh' ,
                "questionId": data?.questionId ?? 'math_logic_4',
                "resultAnswer": data?.resultAnswer ?? '2970',
                "resultTimeSec": data?.resultTimeSec ?? '3',
            }
            const res = await getQuestionResult(req);
            let reply = res?.data?.payload?.body?.reply;
            let result = JSON.parse(reply);

            // csm 상위로 결과 전달
            result.status = "success";
            if (props.onResult) props.onResult(result);

            // 피드백 표시 -> 또로로 전달.
            //setFeedback(result.questions?.explanation || "정답 확인!");
        } catch (err) {
            let result = {status : "error"}
            if (props.onResult) props.onResult(result);
            setFeedback("AI 피드백 실패");
            console.error('문제풀이 결과 조회 실패:', err);
            alert('문제풀이 결과 조회 실패');
        }
    };

    useEffect(() => {
        (async () => {
            await loadNextQuestion();
        })();
        // eslint-disable-next-line
    }, []);

    const submit = async () => {
        if (!question) return;
        setTimerActive(false);
        setSubmitted(true); // 제출 버튼 숨김
        try {


            await handleResult({
                questionId: question.questionId,
                resultAnswer: answer,
                resultTimeSec: timeTaken,
            });


            // csm 챗봇에 버튼 보여서, 계속 클릭 가능. 일단 제출하면 버튼 숨김
            //setDone(true);
        } catch (e) {
            console.error("AI 피드백 실패", e);
            setFeedback("AI 피드백 실패");
        }
    };

    const quit = () => {
        setDone(true);
        if (props.onDone) props.onDone();
    }

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

            {/* 제출/그만풀기 버튼: 피드백이 없고, done이 아닐 때만 노출 */}
            {!feedback && !done && !submitted && (
                <div style={{marginTop: "10px"}}>
                    <button onClick={quit}>그만풀래</button>
                    <button onClick={submit} style={{marginLeft: "10px"}}>제출</button>
                </div>
            )}

            {/* 피드백(퀴즈 결과) 있을 때만 다음 문제 버튼 노출 */}
            {feedback && !done && (
                <div style={{ marginTop: "20px" }}>
                    <p>{feedback}</p>
                    <button onClick={loadNextQuestion} style={{ marginLeft: "10px" }}>다음 문제</button>
                </div>
            )}
        </div>
    );
};

export default QuizPage;