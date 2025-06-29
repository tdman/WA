// src/components/LogoutButton.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { UserContext } from '../context/UserContext';

function LogoutButton() {
  const { user, login, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃 처리 (예: 토큰 삭제, 상태 초기화 등)

    logout({});
    navigate("/");
  };

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={handleLogout}
      sx={{
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "#f44336",
          color: "#fff",
          transform: "scale(1.05)",
          boxShadow: "0 4px 10px rgba(244, 67, 54, 0.5)",
        },
      }}
    >
      로그아웃
    </Button>
  );
}

export default LogoutButton;
