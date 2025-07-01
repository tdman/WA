import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Button, Typography } from "@mui/material";
import LogoutButton from "../components/LogoutButton";

function MainPage() {
  const navigate = useNavigate();

  // 로그아웃 시, 로그인 화면으로 이동
  const handleLogout = () => {
    // 여기에 토큰 삭제 등 로그아웃 처리 코드 추가 가능
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}>
        <LogoutButton />
      </Box>

      <Box sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          환영합니다!
        </Typography>
        <Typography variant="body1" gutterBottom>
          아래에서 기능을 선택해주세요.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mb: 2,
              py: 2,
              fontSize: "1.2rem",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#1565c0",
                transform: "scale(1.05)",
                boxShadow: "0 6px 12px rgba(21, 101, 192, 0.6)",
              },
            }}
            onClick={() => navigate("/problems")}
          >
            문제풀이 시작
          </Button>

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{
              mb: 2, // mb: 2 추가!
              py: 2,
              fontSize: "1.2rem",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#9c27b0",
                transform: "scale(1.05)",
                boxShadow: "0 6px 12px rgba(156, 39, 176, 0.6)",
              },
            }}
            onClick={() => navigate("/chat")}
          >
            챗봇 이용하기
          </Button>

          <Button
            variant="contained"
            color="warning"
            fullWidth
            sx={{
              mb: 2, // mb: 2 추가!
              py: 2,
              fontSize: "1.2rem",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#fbc02d", // 진한 노랑
                transform: "scale(1.05)",
                boxShadow: "0 6px 12px rgba(251, 192, 45, 0.6)", // 노랑 그림자
              },
            }}
            onClick={() => navigate("/tutor")}
          >
            튜터 예약하기
          </Button>


          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mb: 2,
              py: 2,
              fontSize: "1.2rem",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#1565c0",
                transform: "scale(1.05)",
                boxShadow: "0 6px 12px rgba(21, 101, 192, 0.6)",
              },
            }}
            onClick={() => navigate("/feedback")}
          >
            피드백임시페이지
          </Button>

        </Box>
      </Box>
    </Container>
  );
}

export default MainPage;
