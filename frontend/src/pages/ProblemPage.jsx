// src/pages/ProblemPage.jsx
import React, { useState, useEffect } from "react";
import ProblemCard from "../components/ProblemCard.jsx";
import Timer from "../components/Timer.jsx";
import TimerReset from "../components/TimerReset.jsx";
import LogoutButton from "../components/LogoutButton.jsx";
import { Container, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

import BackButton from "../components/BackButton";

import { useNavigate } from "react-router-dom";


// 배열을 랜덤하게 섞는 유틸
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

function ProblemPage() {

  const navigate = useNavigate();
  
  const allProblems = [
    { id: "q1", questionText: "5 + 7 = ?" },
    { id: "q2", questionText: "10 - 3 = ?" },
    { id: "q3", questionText: "4 x 2 = ?" },
    { id: "q4", questionText: "15 ÷ 3 = ?" },
    { id: "q5", questionText: "9 + 6 = ?" },
    { id: "q6", questionText: "12 - 4 = ?" },
    { id: "q7", questionText: "3 x 5 = ?" },
    { id: "q8", questionText: "8 ÷ 2 = ?" },
  ];

  
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [results, setResults] = useState([]);
  const [resetKey, setResetKey] = useState(Date.now());

  // 최초 랜덤 문제 5개 선택
  useEffect(() => {
    const random5 = shuffleArray(allProblems).slice(0, 5);
    setProblems(random5);
  }, []);


  const dummyProblem = { id: "q1", questionText: "5 + 7 = ?" };
  

 
  const handleNext = (userAnswer) => {
    const currentProblem = problems[currentIndex];

    const result = {
      problemId: currentProblem.id,
      question: currentProblem.questionText,
      answer: userAnswer,
      time: timeTaken,
    };

    setResults((prev) => [...prev, result]);

    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setResetKey(Date.now());
    } else {
      console.log("랜덤 문제 완료 결과:", results.concat(result));
       navigate("/feedback", { state: { results: results.concat(result) } });
     // alert("문제풀이 완료! (AI 피드백 페이지로 이동 예정)");
       //navigate("/feedback");
       
    //  navigate("/feedback", { state: updatedResults });
    }
  };

  
  // 문제 배열이 준비되기 전엔 로딩 표시
  if (problems.length === 0) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5">문제를 불러오는 중...</Typography>
      </Container>
    );
  }


  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>

        {/* 애니메이션: 로그아웃 버튼 */}
    
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2}}>
        <BackButton />   
        <LogoutButton />
      </Box>

  

      {/* 애니메이션: 타이머 */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Box sx={{ mt: 3 }}>
          <Timer />
        </Box>
        
      </motion.div>  {/* 애니메이션: 타이머 */}
      
      <motion.div
        key={problems[currentIndex].id}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ProblemCard
          problem={problems[currentIndex]}
          onNext={handleNext}
        />
      </motion.div>

      <TimerReset resetTrigger={resetKey} onTimeUpdate={setTimeTaken} />

      <Typography
        variant="caption"
        display="block"
        align="center"
        sx={{ mt: 2, color: "gray" }}
      >
        {currentIndex + 1} / {problems.length} 문제
      </Typography>
    </Container>
  );
}

export default ProblemPage;
