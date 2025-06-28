import axios from 'axios';

// 전역 API 기본 URL 설정
const axiosInstance = axios.create({
  baseURL: 'http://localhost:55500', // ← 필요한 경우 /api 생략 가능
  timeout: 5000,
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

export default axiosInstance;
