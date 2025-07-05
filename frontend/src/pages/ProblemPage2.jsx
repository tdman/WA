import { useEffect, useState } from "react";
import axios from "axios";

const ProblemPage = () => {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.post("/questions/search", {
      mode: "standard",
      count: 5,
      subjectType: "",
      questionType: "",
      difficulty: "",
      since: ""
    }).then(res => {
      setQuestions(res.data);
    }).catch(() => {
      setError("문제 불러오기 실패");
    });
  }, []);

  const submitAnswer = async () => {
    const q = questions[index];
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/feedback", {
        question: q.question_content,
        studentAnswer: answer,
        answer: q.answer,
        explanation: q.explanation
      });
      setFeedback(res.data.feedback);
    } catch (err) {
      setError("피드백 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    setAnswer("");
    setFeedback("");
    setIndex(i => i + 1);
  };

  if (error) return <div>{error}</div>;
  if (questions.length === 0) return <div>문제 불러오는 중...</div>;
  if (index >= questions.length) return <div>모든 문제를 완료했습니다!</div>;

  const q = questions[index];

  return (
    <div style={{ padding: "20px" }}>
      <h2>문제 {index + 1}</h2>
      <p>{q.question_content}</p>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="정답 입력"
      />
      <button onClick={submitAnswer} disabled={loading || !answer}>
        제출
      </button>
      {loading && <p>AI 피드백 생성 중...</p>}
      {feedback && (
        <div>
          <h3>AI 피드백</h3>
          <p>{feedback}</p>
          <button onClick={next}>다음 문제</button>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;
