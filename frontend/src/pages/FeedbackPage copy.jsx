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
  const location = useLocation();
  //TODO 오희진 임시 데이터 

  
    useEffect(() => {
      console.log('aaasdasdasdasd');
      console.log('isLoggedIn', isLoggedIn);
      console.log('isLoading',isLoading);
      handleFeedback();
    }, [isLoading]);

   let data = '';
    const handleFeedback = async () => {
      console.log('FeedbackPage/handleFeedback');
  
      console.log('FeedbackPage/handleFeedback/location', location);
      try {
        //서버전송

        let req  =  { 
          "studentId": "STU1", 
          "attemptId": "20250629-STU1-3" 
        }

        const res = await getQuestionFeedback(req);
         data = res?.data?.payload?.body?.reply;
        
        console.log('FeedbackPage/handleFeedback/data', data)
      const parsed = parseFeedback(data);

console.log('parseFeedback', JSON.stringify(parsed, null, 2));

      } catch (err) {
        console.error(' 문제풀이 결과 피드백 조회 실패:', err);
        alert(' 문제풀이 결과 피드백 조회 실패');
      }
    };
    

  // 가공 함수
function parseFeedback(reply) {
  const lines = reply.split('\n').map(line => line.trim()).filter(Boolean);

  const questions = [];
  let current = null;
  let summary = {
    strength: [],
    weakness: [],
    direction: '',
    encouragement: ''
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('문제번호:')) {
      if (current) questions.push(current);
      current = {
        questionNumber: line.split(':')[1].trim(),
        isCorrect: '',
        understanding: '',
        feedback: ''
      };
    } else if (line.startsWith('정답여부:')) {
      current.isCorrect = line.split(':')[1].trim();
    } else if (line.startsWith('이해도:')) {
      current.understanding = line.split(':')[1].trim();
    } else if (line.startsWith('피드백:')) {
      current.feedback = line.split(':')[1].trim().replace(/^"/, '').replace(/"$/, '');
    }

    if (line.startsWith('종합 평가:')) {
      if (current) questions.push(current);
      current = null;
    }

    if (line.startsWith('학생의 강점:')) {
      i++;
      while (lines[i]?.startsWith('-')) {
        summary.strength.push(lines[i++].replace('- ', ''));
      }
    }

    if (line.startsWith('부족한 부분:')) {
      i++;
      while (lines[i]?.startsWith('-')) {
        summary.weakness.push(lines[i++].replace('- ', ''));
      }
    }

    if (line.startsWith('앞으로의 학습 방향:')) {
      i++;
      let directionLines = [];
      while (lines[i]?.startsWith('-')) {
        directionLines.push(lines[i++].replace('- ', ''));
      }
      summary.direction = directionLines.join(' ');
    }

    if (i === lines.length - 1 && !summary.encouragement) {
      summary.encouragement = lines[i];
    }
  }

  return {
    questions,
    summary
  };
}
const results = [];
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>

        {/* 애니메이션: 로그아웃 버튼 */}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2}}>
            <BackButton />   
            <LogoutButton />
        </Box>
            <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => navigate("/main")}
      >
        메인으로 돌아가기
      </Button>
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
{data}
        {/* {results.map((item, index) => (
          <ListItem key={index}>
            <Typography variant="body1">
              {index + 1}. {item.question} <br />
              📝 답변: {item.answer} | ⏱️ 시간: {item.time}초
            </Typography>
          </ListItem>
        ))} */}
      </List>

{data}

      
    </Container>
  );
}

export default FeedbackPage;
