import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

import FloatingChat from './components/FloatingChat'; // 추가
import BackgroundImage from './components/BackgroundImage';
/**
 * App.jsx - 앱 루트 컴포넌트
 * @returns 
 */
function App() {
  return (
    <Router>
      <BackgroundImage />
      <AppRoutes />
        <FloatingChat /> {/* 플로팅 챗봇 버튼 추가 */}
    </Router>
  );
}

export default App;