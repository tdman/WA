/**
 * 
 */
// pages/ChatPage.js
import React from 'react';
import ChatBot from '../components/ChatBot.jsx';
import LogoutButton from "../components/LogoutButton.jsx";
import BackButton from "../components/BackButton.jsx";
import { Container, Box } from "@mui/material";

function ChatPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
     {/* 애니메이션: 로그아웃 버튼 */}
     
    
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2}}>
        <BackButton />   
        <LogoutButton />
      </Box>

      <ChatBot />
     </Container>
  );
}

export default ChatPage;