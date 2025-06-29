import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let sessionId = localStorage.getItem('chatbot-session');
    console.log('[GET in useEffect]', sessionId);

    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('chatbot-session', sessionId);
      console.log('[SET new in useEffect]', sessionId);
    }
  }, []);

  // 메시지 전송 함수
    const handleSend = async () => {
      if (!input.trim()) return;

      const sessionId = localStorage.getItem('chatbot-session');

      // 1. 사용자 메시지 추가
      setMessages((prev) => [...prev, { sender: 'user', text: input }]);
      const userMessage = input;
      setInput('');

      try {
        // 2. 백엔드로 메시지 전송
        const response = await fetch('http://localhost:55500/chat/support/bot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId: sessionId, message: userMessage }),
        });

        // 3. 응답 처리
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          // AI 응답 메시지 추가
          setMessages((prev) => [
            ...prev,
            { sender: '챗봇', text: data.reply }
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: '챗봇', text: '서버에서 오류가 발생했습니다.' }
          ]);
        }
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { sender: '챗봇', text: '네트워크 오류가 발생했습니다.' }
        ]);
      }
    };

  return (
    <Box sx={{ mt: 4, width: '100%', maxWidth: 800 }}>
      <Paper elevation={3} sx={{ p: 2, height: 500, overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>챗봇</Typography>
        <List>
          {messages.map((msg, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={msg.text}
                secondary={msg.sender === 'user' ? '나' : '챗봇'}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Box sx={{ display: 'flex', mt: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="질문을 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <IconButton onClick={handleSend} color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatBot;
