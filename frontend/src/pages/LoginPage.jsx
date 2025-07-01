import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/axiosInstance';
import { UserContext } from '../context/UserContext';

function LoginPage() {
  const [studentId, setStudentId] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const { user, login, logout, isLoggedIn, isLoading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate('/main');
  }, [isLoggedIn]);

  const handleLogin = async () => {
    setSubmitClicked(true);
    if (!studentId) return;

    try {
      //서버전송
      const res = await loginUser({ studentId });
      const userData = res?.data?.payload;
      
      if(!userData) {
        alert('로그인 실패:');
        return false;
      } 

      //로컬스토리지저장
      login({
        studentId: userData.studentId,
        name: userData.name,
      });

      navigate('/main');
      
    } catch (err) {
      console.error('로그인 실패:', err);
      alert('로그인 실패:');
    }
  };

  const handleJoin = async () => {
    navigate('/signup');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #e3f2fd, #fce4ec)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 360,
          p: 4,
          borderRadius: 4,
          backgroundColor: '#ffffffdd',
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h5" textAlign="center" fontWeight={600}>
            AI 학습 시스템 로그인
          </Typography>

          <TextField
            label="학생 아이디"
            fullWidth
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            error={studentId === '' && submitClicked}
            helperText={studentId === '' && submitClicked ? '아이디를 입력해주세요.' : ''}
          />

          <Button variant="contained" fullWidth onClick={handleLogin}>
            로그인
          </Button>

          <Button variant="outlined" fullWidth onClick={handleJoin}>
            회원가입
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default LoginPage;
