import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

function FeedbackCard({ feedback }) {
  if (!feedback) return null;

  const { summary, encouragement, averageTime, userTime, difficulty } = feedback;

  return (
    <Card sx={{ mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📘 AI 피드백 요약
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip label={`난이도: ${difficulty}`} color="secondary" />
          <Chip label={`풀이 시간: ${userTime}s`} />
          <Chip label={`적정 시간: ${averageTime}s`} />
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>분석:</strong> {summary}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EmojiEmotionsIcon color="warning" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {encouragement}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default FeedbackCard;
