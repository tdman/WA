// src/pages/FeedbackPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Box, Typography, List, ListItem, Button } from "@mui/material";
import LogoutButton from "../components/LogoutButton.jsx";
import BackButton from "../components/BackButton.jsx";
function FeedbackPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const results = Array.isArray(location.state.results) ? location.state.results : [];
  console.log('문제푼 결과 state: ', location.state);
  console.log('문제푼 결과 results: ', location.state.results);
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>

        {/* 애니메이션: 로그아웃 버튼 */}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2}}>
            <BackButton />   
            <LogoutButton />
        </Box>
            
        <Typography variant="h4" gutterBottom>
            🧠 AI 피드백 결과
        </Typography>

      <List>
        {results.map((item, index) => (
            <ListItem key={index}>
                <Typography variant="body1">
                {index + 1}. 문제 ID: {item.problemId}<br />
                📝 답변: {item.answer.userAnswer} <br />
                ✅ 이해도: {item.answer.understood ? "좋음" : "보통"} <br />
                ⏱️ 시간: {item.answer.elapsedTime}초
                </Typography>
            </ListItem>
            ))}

        {/* {results.map((item, index) => (
          <ListItem key={index}>
            <Typography variant="body1">
              {index + 1}. {item.question} <br />
              📝 답변: {item.answer} | ⏱️ 시간: {item.time}초
            </Typography>
          </ListItem>
        ))} */}
      </List>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => navigate("/main")}
      >
        메인으로 돌아가기
      </Button>
    </Container>
  );
}

export default FeedbackPage;
