import React, { useEffect, useState, useRef } from 'react';
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
import '../css/TtoroChat2.css';

const TTORO_EMOJI = "🧸";
const USER_EMOJI = "🌟";
const TTORO_IMG = "/img.png";


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

function TtoroChat2() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('사용자');
    const [userInfo, setUserInfo] = useState({});
    const listRef = useRef(null);

    useEffect(() => {
        let sessionId = localStorage.getItem('chatbot-session');
        if (!sessionId) {
            sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
            localStorage.setItem('chatbot-session', sessionId);
        }
        try {
            setUserInfo(JSON.parse(localStorage.user));
            setUserName(JSON.parse(localStorage.user).name);
        } catch (e) {
            console.error('사용자 정보 로드 실패:', e);
            setUserName('사용자');
        }
    }, []);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

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
                body: JSON.stringify({ sessionId: sessionId, message: userMessage, studentId: userInfo.studentId }),
            });
            if (response.ok) {
                const data = await response.json();
                setMessages((prev) => [
                    ...prev,
                    { sender: '또로핑', text: data.reply }
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { sender: '또로핑', text: '서버에서 오류가 발생했습니다.' }
                ]);
            }
        } catch (e) {
            console.error('네트워크 오류:', e);
            setMessages((prev) => [
                ...prev,
                { sender: '또로핑', text: '네트워크 오류가 발생했습니다.' }
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
                            backgroundColor: 'rgba(255, 255, 255, 0.65)'
                        }}
                        ref={listRef}
                    >
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            //position: 'sticky',
                            top: 0,
                            zIndex: 2,
                            //backgroundColor: 'rgba(255,255,255,0.85)',
                            //px: 2,
                            //pt: 2,
                            //pb: 1,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}>
                            <span style={{ fontSize: 38, marginRight: 8 }}>{TTORO_EMOJI}</span>
                            <Typography variant="h6" gutterBottom>또로핑</Typography>
                        </Box>
                        <List>
                            {messages.length === 0 && (
                                <ListItem>
                                    <ListItemText
                                        primary={`${TTORO_EMOJI} 또로핑이랑 얘기하자!`}
                                        secondary="안녕!"
                                    />
                                </ListItem>
                            )}
                            {messages.map((msg, i) => (
                                <ListItem
                                    key={i}
                                    sx={{
                                        flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                                        alignItems: 'flex-end',
                                        border: 'none',
                                        background: 'none',
                                        pr: msg.sender === 'user' ? 2 : 0,
                                        pl: msg.sender === 'user' ? 0 : 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: '75%',
                                            position: 'relative',
                                            bgcolor: msg.sender === 'user' ? '#fffde7' : '#fff9c4', // 더 자연스러운 노랑톤
                                            color: '#795548',
                                            px: 2,
                                            py: 1.2,
                                            borderRadius: 3,
                                            borderTopRightRadius: msg.sender === 'user' ? 0 : 16,
                                            borderTopLeftRadius: msg.sender === 'user' ? 16 : 0,
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
                                            border: '1px solid #ffe082',
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 4, // 꼬리가 본체와 자연스럽게 연결되도록 약간 올림
                                                width: 0,
                                                height: 0,
                                                borderTop: 0,
                                                borderBottom: '14px solid',
                                                borderBottomColor: msg.sender === 'user' ? '#fffde7' : '#fff9c4', // 본체와 동일한 색상
                                                right: msg.sender === 'user' ? -10 : 'auto',
                                                left: msg.sender === 'user' ? 'auto' : -10,
                                                transform: msg.sender === 'user' ? 'rotate(18deg)' : 'rotate(-18deg)', // 회전값 미세 조정
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.10)',
                                            }
                                        }}
                                    >
                                        {msg.sender === '또로핑'
                                            ? parseMessageWithLink(msg.text, handleLinkClick)
                                            : msg.text}
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: 'block',
                                                color: '#a1887f',
                                                fontWeight: 700,
                                                textAlign: msg.sender === 'user' ? 'right' : 'left',
                                                mt: 0.5,
                                                opacity: 0.85,
                                                letterSpacing: 0.5,
                                            }}
                                        >
                                            {msg.sender === 'user' ? (
                                                <>
                                                    {USER_EMOJI} {userName}
                                                </>
                                            ) : (
                                                <>
                                                    <img src={TTORO_IMG} alt="또로핑" style={{ width: 24, height: 24, verticalAlign: 'middle', marginRight: 4 }} />
                                                    또로핑
                                                </>
                                            )}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    <Box sx={{ display: 'flex', mt: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="메시지를 입력하세요..."
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
            <div style={{ marginTop: '-100px', textAlign: 'center' }}>
                <img
                    src="../../public/ttoro_walk_pause_slower.gif"
                    alt="걷는 또로"
                    style={{ width: '210px', height: 'auto' }}
                />
            </div>
        </div>
    );
}

export default TtoroChat2;