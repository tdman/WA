// src/components/BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 브라우저 히스토리에서 뒤로가기
  };

  return (
    <Button
      startIcon={<ArrowBackIcon />}
      variant="outlined"
      onClick={handleBack}
      sx={{
        px: 2,
        py: 1,
        fontWeight: "bold",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "#1976d2",
          color: "#fff",
          transform: "scale(1.05)",
          boxShadow: "0 4px 10px rgba(25, 118, 210, 0.5)",
        },
      }}
    >
      뒤로가기
    </Button>
  );
}

export default BackButton;
