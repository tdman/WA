import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import StudentSignup from '../pages/StudentSignup';
import MainPage from '../pages/MainPage';
import ProblemPage from '../pages/ProblemPage';
import FeedbackPage from '../pages/FeedbackPage';
import ChatPage from '../pages/ChatPage';

/**
 * routes/AppRoutes.js - 화면 라우팅 정의
 * @returns 
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<StudentSignup />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/problems" element={<ProblemPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}

export default AppRoutes;