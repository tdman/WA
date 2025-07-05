import { useEffect, useState } from "react";
import axios from "axios";

const QuizPage = () => {
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

    useEffect(() => {
        loadNextQuestion();
    }, []);

    const submit = async () => {
        if (!question) return;
        try {
            const res = await axios.post("http://localhost:55500/questions/feedback", {
                questionId: question.questionId,    // 원본 문제 ID
                studentAnswer: answer               // 사용자 입력값
            });

            console.log('res >>>>>>> ',res);

            setFeedback(res.data?.result?.data?.feedback || "피드백 없음");
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
