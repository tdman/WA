// PrivateRoute.jsx
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from './UserContext';
export default function PrivateRoute({ children }) {
  const { user, login, logout, isLoggedIn, isLoading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
   
    if (isLoading) {
      // 로딩 중일 때 아무 것도 보여주지 않거나 로딩 스피너 등
      // return <div>Loading...</div>;
    } else {
      
          if (!isLoggedIn) {
            //alert('로그인이 필요한 페이지입니다.');
            navigate('/');
          }

    }
  }, [isLoggedIn, isLoading, navigate]);

  return  children
  // return isLoggedIn ? children : null; // 로그인 안되었을 땐 렌더링 안 함
}
