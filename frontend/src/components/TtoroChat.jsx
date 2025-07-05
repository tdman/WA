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
import '../css/TtoroChat.css';

function parseMessageWithLink(text, handleLinkClick) {
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
                    backgroundColor: '#b2dfdb',
                    color: '#37474f',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        backgroundColor: '#80cbc4',
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

function TtoroChat() {
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
        <div className="chatbot-background">
            <div className="chatbot-inside">
                <Box sx={{ width: '100%', maxWidth: 800, height: '100%' }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            height: '100%',
                            overflowY: 'auto',
                            backgroundColor: 'rgba(255, 255, 255, 0.65)'  // ✅ 약간의 투명도 추가
                        }}
                    >
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <IconButton onClick={handleSend} color="primary">
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Box>
            </div>
            {/* ✅ 하단에 GIF 삽입 */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <img
                    src="../assets/ttoro_walk_pause_slower.gif"
                    alt="걷는 또로"
                    style={{ width: '120px', height: 'auto' }}
                />
            </div>
        </div>
    );
}

export default TtoroChat;
