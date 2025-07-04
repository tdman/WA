import React, { useState, useContext, useEffect } from 'react';
import {
  TextField, Button, Box, Typography, Paper, Stack, Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/axiosInstance';
import { UserContext } from '../context/UserContext';

// 🧸 또로 이미지 임포트 (public 경로 또는 이미지 CDN 사용)
import tororoImage from '../assets/ttoro.png'; // 경로에 따라 수정하세요

function LoginPage() {
  const [studentId, setStudentId] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const { login, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate('/main');
  }, [isLoggedIn]);

  const handleLogin = async () => {
    setSubmitClicked(true);
    if (!studentId) return;

    try {
      const res = await loginUser({ studentId });
      const userData = res?.data?.payload;

      if (!userData) {
        alert('또로가 아이디를 못 찾았어요 🥺');
        return;
      }

      login({
        studentId: userData.studentId,
        name: userData.name,
      });

      navigate('/main');
    } catch (err) {
      console.error('로그인 실패:', err);
      alert('또로가 로그인에 실패했어요! 😢');
    }
  };

  const handleJoin = () => navigate('/signup');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #f8bbd0 0%, #e1f5fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 6,
          backgroundColor: 'rgba(255,255,255,0.95)',
          position: 'relative',
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* 🧸 또로 이미지 */}
          <Avatar
            alt="또로"
            src={tororoImage}
            sx={{
              width: 100,
              height: 100,
              mb: 1,
              border: '3px solid #f48fb1',
              boxShadow: 3,
              backgroundColor: '#fff',
            }}
          />

          {/* 말풍선 텍스트 */}
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight={600}
            sx={{
              fontFamily: 'Cute Font, sans-serif',
              color: '#ec407a',
            }}
          >
            안뇽! 난 또로야 💕<br />
            너랑 같이 문제 풀 준비됐지? 📚
          </Typography>

          <TextField
            label="아이디를 입력해줘~!"
            fullWidth
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            error={studentId === '' && submitClicked}
            helperText={studentId === '' && submitClicked ? '아이디를 입력해줘~!' : ''}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              backgroundColor: '#f06292',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#ec407a',
              },
            }}
          >
            또로랑 로그인 💖
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleJoin}
            sx={{
              borderColor: '#f06292',
              color: '#f06292',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#ec407a',
                backgroundColor: '#fff0f5',
              },
            }}
          >
            처음이야? 회원가입 🐣
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default LoginPage;
