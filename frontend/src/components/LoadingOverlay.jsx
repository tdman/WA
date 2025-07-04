import React from "react";
import { Box, CircularProgress } from "@mui/material";

function LoadingOverlay({ open = false }) {
  if (!open) return null;
  return (
      <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.35)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
      >
        <CircularProgress size={80} thickness={5} color="primary" />
      </Box>
  );
}

export default LoadingOverlay;