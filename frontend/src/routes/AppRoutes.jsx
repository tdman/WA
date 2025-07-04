import React from 'react';
import {Route, Routes} from 'react-router-dom';

import PrivateRoute from '../context/PrivateRoute';
import TtoroChat from "../components/TtoroChat.jsx";
import TtoroChat2 from "../components/TtoroChat2.jsx";

/**
 * routes/AppRoutes.js - 화면 라우팅 정의
 * @returns
 */
function AppRoutes() {
    return (
        <Routes>
            {/*<Route path="/" element={<LoginPage/>}/>*/}
            {/*<Route path="/signup" element={<StudentSignup/>}/>*/}
            {/*<Route path="/main" element={<PrivateRoute><MainPage/></PrivateRoute>}/>*/}
            {/*<Route path="/problems" element={<PrivateRoute><ProblemPage/></PrivateRoute>}/>*/}
            {/*<Route path="/feedback" element={<PrivateRoute><FeedbackPage/></PrivateRoute>}/>*/}
            {/*<Route path="/chat" element={<PrivateRoute><ChatPage/></PrivateRoute>}/>*/}
            {/*<Route path="/tutor" element={<PrivateRoute><TutorPage/></PrivateRoute>}/>*/}
            {/*<Route path="/tutorDetail/:tutorId" element={<PrivateRoute><TutorDetailPage/></PrivateRoute>}/>*/}
            {/*<Route path="/progress" element={<PrivateRoute><ProgressPage/></PrivateRoute>}/>*/}
            {/*<Route path="/main" element={<PrivateRoute><TtoroChat/></PrivateRoute>}/>*/}
            <Route path="/main" element={<PrivateRoute><TtoroChat2/></PrivateRoute>}/>
        </Routes>
    );
}

export default AppRoutes;