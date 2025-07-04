import React, { useState, useContext, useEffect } from 'react';
import {
  TextField, Button, Box, Typography, Paper, Stack, Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/axiosInstance';
import { UserContext } from '../context/UserContext';
import ttoroImage from '../assets/ttoro.png'; // 또로 이미지 경로

const balloonMessages = [
  '안뇽! 나는 또로야 🐰',
  '로그인하고 같이 공부해보자! ✏️',
  '또로랑 문제 푸는 거 진짜 재밌어!',
  '오늘도 힘내보자아~ 💪',
  '너무 어렵다고 포기하지 않기! 😎',
];

function LoginPage() {
  const [studentId, setStudentId] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const [balloonText, setBalloonText] = useState(balloonMessages[0]);

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
      alert('또로가 로그인에 실패했어요 😢');
    }
  };

  const handleJoin = () => navigate('/signup');

  const handleBalloonChange = () => {
    const next = balloonMessages[Math.floor(Math.random() * balloonMessages.length)];
    setBalloonText(next);
  };
  // ⏱️ 2초마다 문구 변경
  useEffect(() => {
    const interval = setInterval(() => {
      const next = balloonMessages[Math.floor(Math.random() * balloonMessages.length)];
      setBalloonText(next);
    }, 3000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fffdee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        position: 'relative',
      }}
    >
      {/* 🐰 또로 이미지 (점프 애니메이션) */}
      {/* <motion.img
        src={ttoroImage}
        alt="ttoro"
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '300px',
          bottom: '20%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      /> */}

      {/* 💬 말풍선 (위쪽에 띄우기) */}
      {/* <motion.div
        variant="h6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute',
          top: '18%',
          textAlign: 'center',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '14px 24px',
          borderRadius: '20px',
          boxShadow: '2px 4px 10px rgba(0,0,0,0.1)',
          maxWidth: '300px',
          fontFamily: 'Cute Font, sans-serif',
          color: '#f06292',
          zIndex: 2,
        }}
      >
        {balloonText}
      </motion.div> */}

      {/* 🎛️ 로그인 카드 */}
      <Paper
        elevation={6}
        sx={{
          width: 300,
          p: 3,
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          zIndex: 3,
        }}
      >
        <Stack spacing={2} alignItems="center">
            {/* 🧸 또로 이미지 */}
       
          <Avatar
            alt="또로"
            src={ttoroImage}
            sx={{
              width: 100,
              height: 100,
              mb: 1,
              border: '3px solid #f48fb1',
              boxShadow: 3,
              backgroundColor: '#fff',
            }}
          />
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight="bold"
            sx={{ color: '#f06292', fontFamily: 'Cute Font, sans-serif' }}
          >
              {balloonText}
          </Typography>

          <TextField
            label="학생 아이디"
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
              '&:hover': { backgroundColor: '#ec407a' },
            }}
          >
            로그인 💖
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleJoin}
            sx={{
              borderColor: '#f06292',
              color: '#f06292',
              '&:hover': {
                backgroundColor: '#fff0f5',
                borderColor: '#ec407a',
              },
            }}
          >
            회원가입 🐣
          </Button>

          <Button
            variant="text"
            fullWidth
            onClick={handleBalloonChange}
            sx={{ fontSize: '0.8rem', color: '#999' }}
          >
            또로가 다른 말도 해줘! 🐰
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default LoginPage;
