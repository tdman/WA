// src/components/Timer.jsx
import React, { useEffect, useState } from "react";

function TimerReset({ resetTrigger, onTimeUpdate }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setSeconds(0); // resetTrigger 변경 시 타이머 초기화
  }, [resetTrigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    onTimeUpdate(seconds);
  }, [seconds, onTimeUpdate]);

  return (
    <div style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
      ⏱️ 문제 당 경과 시간: {seconds}초
    </div>
  );
}

export default TimerReset;
