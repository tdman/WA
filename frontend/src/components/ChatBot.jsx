import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function parseMessageWithLink(text, handleLinkClick) {
  // [텍스트](url) 패턴
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|localhost:[^\s)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    const label = match[1];
    const url = match[2];
    parts.push(
        <Button
            key={key++}
            variant="contained"
            size="small"
            sx={{
              mx: 1,
              verticalAlign: 'middle',
              backgroundColor: '#b2dfdb', // 연한 민트
              color: '#37474f',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#80cbc4', // 조금 더 진한 민트
                boxShadow: 'none',
              },
              borderRadius: 2,
              textTransform: 'none'
            }}
            onClick={() => handleLinkClick(url)}
        >
          {label}
        </Button>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }
  return parts;
}

function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let sessionId = localStorage.getItem('chatbot-session');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('chatbot-session', sessionId);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const sessionId = localStorage.getItem('chatbot-session');
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    const userMessage = input;
    setInput('');
    try {
      const response = await fetch('http://localhost:55500/chat/support/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId, message: userMessage }),
      });
      if (response.ok) {
        const data = await response.json();
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

  const handleLinkClick = (url) => {
    window.location.href = url.startsWith('http') ? url : `http://${url}`;
  };

  return (
      <Box sx={{ mt: 4, width: '100%', maxWidth: 800 }}>
        <Paper elevation={3} sx={{ p: 2, height: 500, overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom>챗봇</Typography>
          <List>
            {messages.map((msg, i) => (
                <ListItem key={i}>
                  {msg.sender === '챗봇' ? (
                      <ListItemText
                          primary={parseMessageWithLink(msg.text, handleLinkClick)}
                          secondary="챗봇"
                      />
                  ) : (
                      <ListItemText
                          primary={msg.text}
                          secondary="나"
                      />
                  )}
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