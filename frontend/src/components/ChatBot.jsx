import React, { useEffect, useState, useRef, useContext } from 'react';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Button,
    Paper,
    InputAdornment
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ConfettiContext } from '../context/ConfettiContext';
import { CanvasConfettiContext } from '../context/CanvasConfettiContext';
import Tutors from '../pages/TutorPage';
import ProblemCard from './ProblemCard';
import Feedback from '../pages/FeedbackPage';

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
                    color: '#222',
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

function ChatBot() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const listRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');

    // Confetti 관련 상태
    const { setShowConfetti } = useContext(ConfettiContext);
    const { fire } = useContext(CanvasConfettiContext);

    const [showTutors, setShowTutors] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const [showProblem, setShowProblem] = useState(false);
    const [currentProblem, setCurrentProblem] = useState({
        id: 1,
        questionText: "2 + 2는 얼마인가요?"
    });

    // 문제 카드
    const handleNextProblem = (result) => {
        // 결과 처리 로직 (예: 서버 전송 등)
        setShowProblem(false); // 문제 카드 닫기
    };

    useEffect(() => {
        let sessionId = localStorage.getItem('chatbot-session');
        if (!sessionId) {
            sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
            localStorage.setItem('chatbot-session', sessionId);
        }
        try {
            setUserName(JSON.parse(localStorage.user).name);
        } catch (e){
            setUserName('사용자');
        }
    }, []);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    const triggerConfettiIfNeeded = (text) => {
        //fire();
        //if (text.includes("축하") || text.includes("폭죽")) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        //}
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const sessionId = localStorage.getItem('chatbot-session');
        setMessages((prev) => [...prev, { sender: 'user', text: input }]);
        const userMessage = input;
        setInput('');
        setLoading(true);
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
                    { sender: '또로핑', text: data.reply }
                ]);
                triggerConfettiIfNeeded(data.reply);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { sender: '또로핑', text: '서버에서 오류가 발생했습니다.' }
                ]);
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { sender: '또로핑', text: '네트워크 오류가 발생했습니다.' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleLinkClick = (url) => {
        window.location.href = url.startsWith('http') ? url : `http://${url}`;
    };

    return (
        <>
            {/*<LoadingOverlay open={loading} />*/}
            <Paper
                elevation={6}
                sx={{
                    width: { xs: '95vw', sm: 400, md: 500 },
                    maxWidth: '100vw',
                    height: { xs: 400, sm: 480, md: 540 },
                    minHeight: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    bgcolor: '#f5fafd',
                    boxShadow: '0 8px 32px rgba(66,165,245,0.18)',
                    border: '1px solid #bbdefb',
                    transition: 'box-shadow 0.2s',
                }}
            >
                {/* 헤더 */}
                <Box
                    sx={{
                        bgcolor: 'linear-gradient(90deg, #42a5f5 0%, #1976d2 100%)',
                        background: 'linear-gradient(90deg, #42a5f5 0%, #1976d2 100%)',
                        color: '#fff',
                        px: 2,
                        py: 1.2,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        letterSpacing: 1,
                        borderBottom: '1px solid #e3f2fd'
                    }}
                >
                    또로핑
                </Box>
                {/* 메시지 영역 */}
                <Box
                    ref={listRef}
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        px: 2,
                        py: 2,
                        bgcolor: '#f5fafd'
                    }}
                >
                    {messages.length === 0 && (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8 }}>
                            또로핑이랑 얘기하자!
                        </Typography>
                    )}
                    {messages.map((msg, i) => (
                        <Box
                            key={i}
                            sx={{
                                display: 'flex',
                                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                                mb: 1.5
                            }}
                        >
                            <Box
                                sx={{
                                    maxWidth: '75%',
                                    bgcolor: msg.sender === 'user'
                                        ? 'linear-gradient(135deg, #90caf9 0%, #42a5f5 100%)'
                                        : '#e3f2fd',
                                    color: msg.sender === 'user' ? '#222' : '#222',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 3,
                                    borderTopRightRadius: msg.sender === 'user' ? 0 : 12,
                                    borderTopLeftRadius: msg.sender === 'user' ? 12 : 0,
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    boxShadow: msg.sender === 'user'
                                        ? '0 2px 8px rgba(66,165,245,0.13)'
                                        : '0 1px 4px rgba(66,165,245,0.07)',
                                    position: 'relative'
                                }}
                            >
                                {msg.sender === '또로핑'
                                    ? parseMessageWithLink(msg.text, handleLinkClick)
                                    : msg.text}
                                {msg.sender === 'user' && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            color: '#222',
                                            fontWeight: 700,
                                            textAlign: 'right',
                                            mt: 0.5,
                                            opacity: 0.85,
                                            letterSpacing: 0.5
                                        }}
                                    >
                                        {userName}
                                    </Typography>
                                )}
                                {msg.sender === '또로핑' && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            color: '#1976d2',
                                            fontWeight: 700,
                                            textAlign: 'left',
                                            mt: 0.5,
                                            opacity: 0.85,
                                            letterSpacing: 0.5
                                        }}
                                    >
                                        또로핑
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    ))}
                    {/* 문제랑, 튜터..렌더링 테스트 */}
                    {showProblem && (
                        <Box sx={{ mt: 2 }}>
                            <ProblemCard
                                problem={currentProblem}
                                onNext={handleNextProblem}
                            />
                        </Box>
                    )}
                    {showTutors && (
                        <Box sx={{ mt: 2 }}>
                            <Tutors />
                        </Box>
                    )}
                    {showFeedback && (
                        <Box sx={{ mt: 2 }}>
                            <Feedback />
                        </Box>
                    )}
                </Box>
                {/* 입력창 */}
                <Box
                    sx={{
                        borderTop: '1px solid #e3f2fd',
                        p: 1.2,
                        bgcolor: '#e3f2fd',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <TextField
                        placeholder="메시지를 입력하세요..."
                        size="small"
                        fullWidth
                        variant="outlined"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') handleSend();
                        }}
                        sx={{
                            bgcolor: '#fff',
                            borderRadius: 2,
                            color: '#222',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                color: '#222',
                            },
                            '& input': {
                                color: '#222',
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSend} color="primary">
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Paper>
            <Button onClick={() => setShowProblem((prev) => !prev)} sx={{ mt: 2 }}>문제 풀기</Button>
            <Button onClick={() => setShowTutors((prev) => !prev)} sx={{ mt: 1, ml: 1 }}>튜터 보기</Button>
            <Button onClick={() => setShowFeedback((prev) => !prev)} sx={{ mt: 1, ml: 1 }}>피드백 보기</Button>
        </>
    );
}

export default ChatBot;