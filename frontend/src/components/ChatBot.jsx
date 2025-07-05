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
import Tutors from '../pages/TutorPage';
import ProblemCard from './ProblemCard';
import Feedback from '../pages/FeedbackPage';
import RewordShop from '../components/RewordShop.jsx';

const DOG_EMOJI = "🐶";

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
                    backgroundColor: '#ffe5b4',
                    color: '#7c4a03',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        backgroundColor: '#ffd699',
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
    const [userInfo, setUserInfo] = useState({});

    const { setShowConfetti } = useContext(ConfettiContext);

    const [showTutors, setShowTutors] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showRewordShop, setShowRewordShop] = useState(false);

    const [showProblem, setShowProblem] = useState(false);
    const [currentProblem, setCurrentProblem] = useState({
        id: 1,
        questionText: "2 + 2는 얼마인가요?"
    });

    const handleNextProblem = (result) => {
        setShowProblem(false);
    };

    useEffect(() => {
        let sessionId = localStorage.getItem('chatbot-session');
        if (!sessionId) {
            sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
            localStorage.setItem('chatbot-session', sessionId);
        }
        try {
            setUserInfo(JSON.parse(localStorage.user));
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

    // 테스트
    useEffect(() => {
        if (showProblem || showTutors || showFeedback || showRewordShop) {
            if (listRef.current) {
                listRef.current.scrollTop = listRef.current.scrollHeight;
            }
        }
    }, [showProblem, showTutors, showFeedback, showRewordShop]);

    const triggerConfettiIfNeeded = (text) => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
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
                body: JSON.stringify({ sessionId: sessionId, message: userMessage, studentId: userInfo.studentId }),
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
        <Box sx={{ position: 'relative', width: 420, mx: 'auto', mt: 4 }}>
            {/* 강아지 귀 */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -40,
                    left: 30,
                    width: 60,
                    height: 80,
                    bgcolor: '#d2a679',
                    borderRadius: '60% 60% 80% 80%',
                    transform: 'rotate(-25deg)',
                    zIndex: 2,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: -40,
                    right: 30,
                    width: 60,
                    height: 80,
                    bgcolor: '#d2a679',
                    borderRadius: '60% 60% 80% 80%',
                    transform: 'rotate(25deg) scaleX(-1)',
                    zIndex: 2,
                }}
            />
            {/* 네모난 강아지 채팅창 */}
            <Paper
                elevation={6}
                sx={{
                    width: 420,
                    height: 520,
                    minHeight: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 6, // 네모 스타일
                    bgcolor: '#fff8ee',
                    boxShadow: 'none', //'0 8px 32px #ffe5b4',
                    border: '4px solid #ffe5b4',
                    position: 'relative',
                    overflow: 'hidden',
                    pt: 7, // 귀 공간 확보
                }}
            >
                {/* 헤더 */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.3rem',
                        color: '#7c4a03',
                        mb: 1,
                        gap: 1
                    }}
                >
                    <span style={{ fontSize: 38, marginRight: 8 }}>{DOG_EMOJI}</span>
                    또로핑
                </Box>
                {/* 메시지 영역 */}
                <Box
                    ref={listRef}
                    sx={{
                        flex: 1,
                        width: '90%',
                        overflowY: 'auto',
                        px: 2,
                        py: 2,
                        bgcolor: 'transparent'
                    }}
                >
                    {messages.length === 0 && (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8 }}>
                            {DOG_EMOJI} 또로핑이랑 얘기하자!
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
                                        ? 'linear-gradient(135deg, #ffd699 0%, #ffe5b4 100%)'
                                        : '#ffe5b4',
                                    color: '#5d3a00',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 4,
                                    borderTopRightRadius: msg.sender === 'user' ? 0 : 16,
                                    borderTopLeftRadius: msg.sender === 'user' ? 16 : 0,
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    boxShadow: msg.sender === 'user'
                                        ? '0 1px 3px #7f5d2a'
                                        : '0 1px 4px #7f5d2a',
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
                                            color: '#7c4a03',
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
                                            color: '#7c4a03',
                                            fontWeight: 700,
                                            textAlign: 'left',
                                            mt: 0.5,
                                            opacity: 0.85,
                                            letterSpacing: 0.5
                                        }}
                                    >
                                        {DOG_EMOJI} 또로핑
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    ))}
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
                    {showRewordShop && (
                        <Box sx={{ mt: 2 }}>
                            <RewordShop />
                        </Box>
                    )}
                </Box>
                {/* 입력창 */}
                <Box
                    sx={{
                        borderTop: '2px solid #ffe5b4',
                        p: 1.2,
                        bgcolor: '#ffe5b4',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: '90%',
                        mb: 2,
                        borderRadius: 2
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
                            borderRadius: 1,
                            color: '#7c4a03',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                                color: '#7c4a03',
                            },
                            '& input': {
                                color: '#7c4a03',
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSend} color="warning">
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Paper>
            {/* 하단 버튼들 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
                <Button onClick={() => setShowProblem((prev) => !prev)} sx={{ bgcolor: '#ffe5b4', color: '#7c4a03', fontWeight: 700 }}>문제 풀기</Button>
                <Button onClick={() => setShowTutors((prev) => !prev)} sx={{ bgcolor: '#ffd699', color: '#7c4a03', fontWeight: 700 }}>튜터 보기</Button>
                <Button onClick={() => setShowFeedback((prev) => !prev)} sx={{ bgcolor: '#ffe5b4', color: '#7c4a03', fontWeight: 700 }}>피드백 보기</Button>
                <Button onClick={() => setShowRewordShop((prev) => !prev)} sx={{ bgcolor: '#ffd699', color: '#7c4a03', fontWeight: 700 }}>보상 보기</Button>
            </Box>
        </Box>
    );
}

export default ChatBot;