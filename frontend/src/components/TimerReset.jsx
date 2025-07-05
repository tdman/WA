// src/components/TimerReset.jsx
import React, { useEffect, useRef, useState } from "react";

function TimerReset({ resetTrigger, onTimeUpdate, active = true }) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  // resetTrigger 변경 시 타이머 초기화
  useEffect(() => {
    setSeconds(0);
  }, [resetTrigger]);

  // active 변경 시 타이머 on/off
  useEffect(() => {
    if (active) {
      if (intervalRef.current) clearInterval(intervalRef.current); // 중복 방지
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active]);

  // 시간 업데이트 전달
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
