import React from 'react';
import {Route, Routes} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import StudentSignup from '../pages/StudentSignup';
import MainPage from '../pages/MainPage';
import ProblemPage from '../pages/ProblemPage';
import FeedbackPage from '../pages/FeedbackPage';
import ChatPage from '../pages/ChatPage';
import TutorPage from '../pages/TutorPage';
import TutorDetailPage from '../pages/TutorDetailPage';

import PrivateRoute from '../context/PrivateRoute';
import ProgressPage from "../pages/ProgressPage.jsx";

/**
 * routes/AppRoutes.js - 화면 라우팅 정의
 * @returns
 */
function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/signup" element={<StudentSignup/>}/>
            <Route path="/main" element={<PrivateRoute><MainPage/></PrivateRoute>}/>
            <Route path="/problems" element={<PrivateRoute><ProblemPage/></PrivateRoute>}/>
            <Route path="/feedback" element={<PrivateRoute><FeedbackPage/></PrivateRoute>}/>
            <Route path="/chat" element={<PrivateRoute><ChatPage/></PrivateRoute>}/>
            <Route path="/tutor" element={<PrivateRoute><TutorPage/></PrivateRoute>}/>
            <Route path="/tutorDetail/:tutorId" element={<PrivateRoute><TutorDetailPage/></PrivateRoute>}/>
            <Route path="/progress" element={<PrivateRoute><ProgressPage/></PrivateRoute>}/>
        </Routes>
    );
}

export default AppRoutes;