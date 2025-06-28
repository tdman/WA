import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel
} from '@mui/material';

function ProblemCard({ problem, onNext }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [understood, setUnderstood] = useState(true);
  const [startTime] = useState(Date.now());

  const handleNext = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    onNext({
      problemId: problem.id,
      userAnswer,
      understood,
      elapsedTime: elapsed,
    });
    setUserAnswer('');
    setUnderstood(true);
  };

  return (
    <Card sx={{ mt: 4, p: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {problem.questionText}
        </Typography>
        <TextField
          fullWidth
          label="답을 입력하세요"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
          autoFocus
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={!understood}
              onChange={() => setUnderstood(!understood)}
            />
          }
          label="이해되지 않았어요"
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleNext}
          disabled={!userAnswer}
        >
          다음 문제
        </Button>
      </CardContent>
    </Card>
  );
}

export default ProblemCard;
