// src/pages/FeedbackPage.jsx
import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestionFeedback } from '../api/axiosInstance';
import { Container, Box, Typography, List, ListItem, Button } from "@mui/material";
import LogoutButton from "../components/LogoutButton.jsx";
import BackButton from "../components/BackButton.jsx";
import { UserContext } from '../context/UserContext';
function FeedbackPage() {

  const { user, login, logout, isLoggedIn, isLoading } = useContext(UserContext);
  // const location = useLocation();
  //TODO 오희진 임시 데이터 

  
    useEffect(() => {
      console.log('aaasdasdasdasd');
      console.log('isLoggedIn', isLoggedIn);
      console.log('isLoading',isLoading);

    }, [isLoading]);

    
      const handleFeedback = async () => {
        console.log('handleFeedback')
       
    
        try {
          //서버전송
          const res = await getQuestionFeedback({ studentId });
          const data = res?.data;
          
        
          
        } catch (err) {
          console.error(' 문제풀이 결과 피드백 조 실패:', err);
          alert(' 문제풀이 결과 피드백 조:');
        }
      };
  const location = {
    "pathname": "/feedback",
    "search": "",
    "hash": "",
    "state": {
        "results": [
            {
                "problemId": "q1",
                "question": "5 + 7 = ?",
                "answer": {
                    "problemId": "q1",
                    "userAnswer": "1",
                    "understood": true,
                    "elapsedTime": 2.453
                },
                "time": 2
            },
            {
                "problemId": "q2",
                "question": "10 - 3 = ?",
                "answer": {
                    "problemId": "q2",
                    "userAnswer": "1",
                    "understood": true,
                    "elapsedTime": 1.09
                },
                "time": 1
            },
            {
                "problemId": "q4",
                "question": "15 ÷ 3 = ?",
                "answer": {
                    "problemId": "q4",
                    "userAnswer": "1",
                    "understood": true,
                    "elapsedTime": 2.527
                },
                "time": 2
            },
            {
                "problemId": "q8",
                "question": "8 ÷ 2 = ?",
                "answer": {
                    "problemId": "q8",
                    "userAnswer": "1",
                    "understood": true,
                    "elapsedTime": 0.729
                },
                "time": 1
            },
            {
                "problemId": "q7",
                "question": "3 x 5 = ?",
                "answer": {
                    "problemId": "q7",
                    "userAnswer": "1",
                    "understood": true,
                    "elapsedTime": 0.952
                },
                "time": 1
            }
        ]
    },
    "key": "2uhjm6ds"
}
  console.log('location', location);
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
