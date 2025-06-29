import axios from 'axios';

// 전역 API 기본 URL 설정
const axiosInstance = axios.create({
  baseURL: 'http://localhost:55500', // ← 필요한 경우 /api 생략 가능
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});



// ✅ 요청 인터셉터: 예) 인증 토큰 추가
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("STR ##########################################################");
    console.log(`[Request Url] ${config.method.toUpperCase()} ${config.url}`);
    console.log(`[Request Data]`, config?.data);
    return config;
  },
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// ✅ 응답 인터셉터: 예) 응답 공통 처리, 에러 핸들링
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[Response Data]`, response);
    console.log("END ##########################################################");
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[Response Error] ${error.response.status}: ${error.response.data.message || '오류'}`);
      if (error.response.status === 401) {
        // 인증 실패 → 로그인 페이지로 이동 등
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/';
      }
    } else {
      console.error('[Network Error]', error.message);
    }
    
    console.log("END ##########################################################");
    return Promise.reject(error);
  }
);



// === API 함수 모음 STR === //

// 0. 테스트
export const conversation = (req) => {
  return axiosInstance.post('/chat/support/conversation', req);
};

// 1. 로그인(사용)
export const loginUser = (req) => {
  return axiosInstance.post('/login', req);
};

// 2. 회원가입(사용)
export const Signup = (req) => {
  return axiosInstance.post('/auth/signup', req);
};

// 2. 랜덤 문제 5개
export const fetchRandomProblems = (req) => {
  return axiosInstance.get('/problems/random');
};

// 3. 문제 결과 저장
export const submitResults = (req) => {
  return axiosInstance.post('/results/submit', req);
};

// 4. 피드백 생성
export const generateFeedback = (req) => {
  return axiosInstance.post('/feedback/generate', req);
};

// 5. 피드백 리포트 조회
export const getFeedbackReport = (req) => {
  return axiosInstance.get(`/feedback/report/${req}`);
};

// 6. 챗봇 질문
export const askChatbot = (req) => {
  return axiosInstance.post('/chatbot/ask', req);
};

// 7. 차트 데이터
export const getChartData = (req) => {
  return axiosInstance.get(`/results/chart/${req}`);
};

// 8. 메일 전송
export const sendParentMail = (req) => {
  return axiosInstance.post('/mail/send', req);
};

// 9. 튜터 스케줄 조회
export const getTutorSchedule = (req) => {
  return axiosInstance.get('/tutor/schedule', req);
};

// 10. 튜터 예약
export const reserveTutor = (req) => {
  return axiosInstance.post('/tutor/reserve', req);
};


// === API 함수 모음 END === //


export default axiosInstance;
