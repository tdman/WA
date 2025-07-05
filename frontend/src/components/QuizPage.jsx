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
            const res = await axios.post("http://localhost:55500/questions/search", {
                mode: "standard",
                subject: "",
                types: [],
                count: 1,
                since: "",
                difficulty: ""
            });
            if (res.data.length === 0) {
                setDone(true);
            } else {
                setQuestion(res.data[0]);
            }
        } catch (e) {
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
                question: question.question_content,
                studentAnswer: answer,
                answer: question.answer,
                explanation: question.explanation
            });
            setFeedback(res.data?.result?.data?.feedback || "피드백 없음");
        } catch (e) {
            setFeedback("AI 피드백 실패");
        }
    };

    const quit = () => setDone(true);

    if (error) return <div>{error}</div>;
    if (done) return <div>문제 풀이를 종료했습니다.</div>;
    if (loading || !question) return <div>문제 불러오는 중...</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            {/*<h2>문제</h2>*/}
            <p><strong>문제:</strong> {question.questionContent}</p>
            {/*<p><strong>과목:</strong> {question.subject_type}</p>*/}
            {/*<p><strong>난이도:</strong> {question.difficulty}</p>*/}
            {/*<p><strong>유형:</strong> {question.question_type}</p>*/}
            {/*{question.tags && (*/}
            {/*    <p><strong>태그:</strong> {Array.isArray(question.tags) ? question.tags.join(", ") : String(question.tags)}</p>*/}
            {/*)}*/}

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
                    {/*<h3>AI 피드백</h3>*/}
                    <p>{feedback}</p>
                    <button onClick={quit}>그만풀래</button>
                    <button onClick={loadNextQuestion} style={{ marginLeft: "10px" }}>다음 문제</button>
                </div>
            )}

        </div>
    );
};

export default QuizPage;
