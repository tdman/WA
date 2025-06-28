import React, { useState } from 'react';
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

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');
    // 추후 AI 응답도 추가 가능
  };

  return (
    <Box sx={{ mt: 4, width: '100%', maxWidth: 500 }}>
      <Paper elevation={3} sx={{ p: 2, height: 300, overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>챗봇</Typography>
        <List>
          {messages.map((msg, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={msg.text}
                secondary={msg.sender === 'user' ? '나' : 'AI'}
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
        />
        <IconButton onClick={handleSend} color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatBot;
