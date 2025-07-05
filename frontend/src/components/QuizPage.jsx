import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from '../context/UserContext';
import { getQuestionResult } from '../api/axiosInstance';

const QuizPage = () => {
    const { user, login, logout, isLoggedIn, isLoading } = useContext(UserContext);
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const loadNextQuestion = async () => {
        setLoading(true);
        setFeedback("");
        setAnswer("");
        try {
            const res = await axios.post("http://localhost:55500/quiz", {
                difficulty: "하" // 필요한 요청 파라미터를 명시적으로 추가
            });
            if (!res.data || !res.data.questionId) {
                setDone(true);
            } else {
                setQuestion(res.data);  // 단일 객체로 받음
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
            let result = JSON.parse(reply);
           // setResult(JSON.parse(reply))
            setFeedback(result?.questions?.explanation || "피드백 없음");
        } catch (err) {

            console.error(' 문제풀이 결과 조회 실패:', err);
            alert(' 문제풀이 결과 조회 실패');
        } finally {
         
        }
    };


    useEffect(() => {
        loadNextQuestion();
    }, []);

    const submit = async () => {
        if (!question) return;
        try {

            handleResult({
                "questionId": question.questionId,
                "resultAnswer": answer,
                "resultTimeSec": '3',
            });
            
        } catch (e) {
            console.error("AI 피드백 실패", e);
            setFeedback("AI 피드백 실패");
        }
    };

    const quit = () => setDone(true);

    if (error) return <div>{error}</div>;
    if (done) return <div>문제 풀이를 종료했습니다.</div>;
    if (loading || !question) return <div>문제 불러오는 중...</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <p><strong>문제:</strong> {question.rewriteQuestion || question.originalQuestion}</p>

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
