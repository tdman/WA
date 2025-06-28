import React, { useState, useEffect } from 'react';
import { Chip } from '@mui/material';

function Timer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Chip
      label={`전체 풀이 시간: ${time}s`}
      color="primary"
      sx={{ mt: 2 }}
    />
  );
}

export default Timer;
