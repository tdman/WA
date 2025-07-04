import React, { useState } from 'react';
import {
  TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  Typography, Paper, Stack, Divider, FormHelperText, Avatar, Box
} from '@mui/material';
import { Signup } from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import tororoImage from '../assets/ttoro.png'; // 또로 이미지 경로

const mbtiQuestions = [
  {
    key: 'EI',
    label: '1. 에너지 방향',
    description: '사람들과 어울릴 때 에너지를 얻는가(E), 혼자 있을 때 회복되는가(I)',
    options: { E: '외향(E)', I: '내향(I)' }
  },
  {
    key: 'SN',
    label: '2. 인식 방식',
    description: '현실적인 정보에 집중하는가(S), 직관과 아이디어를 선호하는가(N)',
    options: { S: '감각(S)', N: '직관(N)' }
  },
  {
    key: 'TF',
    label: '3. 판단 기준',
    description: '논리와 객관적인 사실로 결정하는가(T), 감정과 공감으로 판단하는가(F)',
    options: { T: '사고(T)', F: '감정(F)' }
  },
  {
    key: 'JP',
    label: '4. 생활 양식',
    description: '계획적이고 체계적인가(J), 융통성 있고 즉흥적인가(P)',
    options: { J: '판단(J)', P: '인식(P)' }
  }
];

export default function StudentSignup() {
  const [form, setForm] = useState({
    student_id: '',
    name: '',
    email: '',
    mbtiParts: { EI: 'E', SN: 'S', TF: 'T', JP: 'J' }
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMbtiChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      mbtiParts: { ...prev.mbtiParts, [key]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mbti = Object.values(form.mbtiParts).join('');

    const res = await Signup({
      studentId: form.student_id,
      name: form.name,
      mbti,
      email: form.email
    });

    const data = res?.data;
    if(!data?.success) {
      alert("학생등록 실패:" +data?.message);
      return false;
    }
    navigate('/');
  };

  const isFormValid = () =>
    form.student_id && form.name && form.email &&
    Object.values(form.mbtiParts).every(v => v !== '');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #fce4ec, #e1f5fe)',
        py: 6,
        px: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 640,
          mx: 'auto',
          borderRadius: 4,
          p: 4,
          backgroundColor: '#fffafc',
          position: 'relative',
        }}
      >
        {/* 🧸 또로 이미지와 인삿말 */}
        <Stack alignItems="center" spacing={1} mb={3}>
          <Avatar
            alt="또로"
            src={tororoImage}
            sx={{
              width: 100,
              height: 100,
              border: '3px solid #f48fb1',
              boxShadow: 2,
              backgroundColor: '#fff',
            }}
          />
          <Typography
            variant="h6"
            align="center"
            fontWeight="bold"
            sx={{ color: '#ec407a', fontFamily: 'Cute Font, sans-serif' }}
          >
            반가워~! 난 또로야 🐰 <br />
            우리 이제 친구하자! 💖
          </Typography>
        </Stack>

        <Typography variant="h5" textAlign="center" fontWeight="bold" mb={2}>
          학생 회원가입
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="학생 ID"
              name="student_id"
              value={form.student_id}
              onChange={handleChange}
              required
              fullWidth
              placeholder="예: hong123"
            />
            <TextField
              label="이름"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="보호자 이메일"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />

            <Typography variant="h6" mt={2}>
              MBTI 성격 유형
            </Typography>

            {mbtiQuestions.map((q) => (
              <FormControl key={q.key} required>
                <FormLabel sx={{ mb: 1 }}>{q.label}</FormLabel>
                <FormHelperText sx={{ mb: 1, ml: 0 }}>
                  {q.description}
                </FormHelperText>
                <RadioGroup
                  row
                  value={form.mbtiParts[q.key]}
                  onChange={(e) => handleMbtiChange(q.key, e.target.value)}
                >
                  {Object.entries(q.options).map(([value, label]) => (
                    <FormControlLabel
                      key={value}
                      value={value}
                      control={<Radio />}
                      label={label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            ))}

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                borderRadius: 2,
                backgroundColor: '#f06292',
                '&:hover': { backgroundColor: '#ec407a' }
              }}
              disabled={!isFormValid()}
            >
              또로랑 가입할래요! ✨
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
