
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';


export const submitLogin= async (resultData) => {
  try {

    const url = '/chat/support/conversation'
    const requestData = {
      "prompt" : "하이"
    }
    const response = await axiosInstance.post(url, requestData);
    console.log(response);
    //return response;
  } catch (error) {
    console.error(url, ' 실패: ', error);
    throw error;
  }
};


export const submitJoin= async (resultData) => {
  try {

    const url = '/chat/support/conversation'
    const requestData = {
      "prompt" : "하이"
    }
    const response = await axiosInstance.post(url, requestData);
    console.log(response);
    //return response;

  } catch (error) {
    console.error(url, ' 실패: ', error);
    throw error;
  }
};

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
       <Button variant="contained" onClick={submitLogin}>로그인</Button>
       <Button variant="contained" onClick={submitJoin}>회원가입</Button>
    </Box>
  );
}

export default LoginPage;