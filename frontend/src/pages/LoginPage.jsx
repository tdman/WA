
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * 
 */
function LoginPage() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // 실제 로그인 로직은 생략
    navigate('/main');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>로그인</Typography>
      <TextField label="아이디" fullWidth sx={{ mb: 2 }} value={id} onChange={(e) => setId(e.target.value)} />
      <TextField label="이름" fullWidth sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
      <Button variant="contained" onClick={handleLogin}>시작하기</Button>
    </Box>
  );
}

export default LoginPage;