// src/pages/FeedbackPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestionFeedback } from '../api/axiosInstance';
import {
  Container, Card, CardContent, Typography, Chip, Grid, Button, Box, Divider
} from '@mui/material';
import { CheckCircle, Cancel, ArrowBack } from '@mui/icons-material';
import LogoutButton from "../components/LogoutButton.jsx";
import BackButton from "../components/BackButton.jsx";
import { UserContext } from '../context/UserContext';

function FeedbackPage() {

  const { user, login, logout, isLoggedIn, isLoading } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  //TODO 오희진 임시 데이터 
  
    useEffect(() => {
      // console.log('aaasdasdasdasd');
      // console.log('isLoggedIn', isLoggedIn);
      // console.log('isLoading',isLoading);
      handleFeedback();
    }, [isLoading]);

     
    useEffect(() => {
      console.log('useEffect data', data);
      // console.log('isLoggedIn', isLoggedIn);
      // console.log('isLoading',isLoading);
      // handleFeedback();
    }, [data]);
 
    const handleFeedback = async () => {
      console.log('FeedbackPage/handleFeedback');
  
   //   console.log('FeedbackPage/handleFeedback/location', location);
      try {
        //서버전송

        let req  =  { 
          "studentId": "STU1", 
          "attemptId": "20250629-STU1-3" 
        }

        const res = await getQuestionFeedback(req);
         let reply = res?.data?.payload?.body?.reply;
        
       // console.log('FeedbackPage/handleFeedback/data', reply)
      //  console.log('FeedbackPage/handleFeedback/data', data)
      //  data = ;
        setData(JSON.parse(reply))
        //console.log('parseFeedback', JSON.stringify(parsed, null, 2));

      } catch (err) {
        console.error(' 문제풀이 결과 피드백 조회 실패:', err);
        alert(' 문제풀이 결과 피드백 조회 실패');
      }
    };
    
 if (!data) return <Typography>피드백을 불러오는 중입니다...</Typography>;
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>🧮 문제별 피드백</Typography>

      <Grid container spacing={3}>
        { data?.questions_result?.map((q) => (
          <Grid item xs={12} key={q.questionNumber}>
            <Card variant="outlined"
                  sx={{
                    backgroundColor: '#f9f9f9',
                    width: '150%',        // 전체 그리드 칸을 다 쓰기
                    maxWidth: '800px',    // 최대 너비 지정 (중요!)
                    margin: '0 auto',     // 가운데 정렬
                  }}>
              <CardContent  sx={{
                    width: '100%',        // 전체 그리드 칸을 다 쓰기
                  }}>
                <Typography variant="h6">문제 {q.questionNumber}: {q.questionContent}</Typography>

                <Box sx={{ mt: 1 }}>
                  <Chip label={`정답: ${q.answer}`} color="primary" sx={{ mr: 1 }} />
                  <Chip label={`답안: ${q.studentAnswer || '미입력'}`} color="secondary" sx={{ mr: 1 }} />
                  <Chip label={`풀이시간: ${q.solveTime}`} variant="outlined" sx={{ mr: 1 }} />
                  <Chip label={`평균: ${q.averageSolveTime}`} variant="outlined" sx={{ mr: 1 }} />
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">정답여부: 
                    {q.isCorrect === "정답" ? (
                      <Chip label="정답" color="success" icon={<CheckCircle />} sx={{ ml: 1 }} />
                    ) : (
                      <Chip label="오답" color="error" icon={<Cancel />} sx={{ ml: 1 }} />
                    )}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  이해도 체크: {q.isMarked === "Y" ? "이해 부족" : "이해함"}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  태그: {q.tags?.join(', ')}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  해설: {q.explanation}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" fontWeight="bold">
                  📢 피드백: 
                </Typography>
                <Typography variant="body1">{q.feedback}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>📌 종합 평가</Typography>
        <Card variant="outlined">
          <CardContent>
            <Typography><strong>💡 강점:</strong> {data?.summary?.strength}</Typography>
            <Typography><strong>❗ 부족한 점:</strong> {data?.summary?.weakness}</Typography>
            <Typography><strong>📈 학습 방향:</strong> {data?.summary?.direction}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>🎉 칭찬과 응원</Typography>
        <Card variant="outlined" sx={{ backgroundColor: '#fff9ea' }}>
          <CardContent>
            <Typography>{data?.summary?.encouragement}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/main")}
        >
          메인으로 돌아가기
        </Button>
      </Box>
    </Container>
  );
};

export default FeedbackPage;
