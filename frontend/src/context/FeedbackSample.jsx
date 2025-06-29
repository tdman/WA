
import FeedbackCard from '../components/FeedbackCard.jsx';

const feedback = {
  summary: "문제풀이 시간이 전체 평균보다 빠르고 정확했어요.",
  encouragement: "잘하고 있어요! 계속 도전해보세요 💪",
  averageTime: 20,
  userTime: 17,
  difficulty: "중",
};

<FeedbackCard feedback={feedback} />
