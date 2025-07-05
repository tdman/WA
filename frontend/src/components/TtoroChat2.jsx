import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import '../css/TtoroChat2.css';
import LogoutButton from "./LogoutButton.jsx";
import walkTtoro from '../assets/ttoro_walk_pause_slower.gif';
import { ConfettiContext } from '../context/ConfettiContext';
import Tutors from '../pages/TutorPage'; // 상단에 추가
import Quiz from './QuizPage'; // 상단에 추가
import Progress from '../pages/ProgressPage';
import ChatPage from "../pages/ChatPage.jsx"; // 상단에 추가

// 임시 컴포넌트
function ProgressPage({onClose}) {
    return (
        <Paper sx={{p: 2, mb: 2, bgcolor: '#e3f2fd'}}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">진도 현황</Typography>
                <Button size="small" onClick={onClose}>닫기</Button>
            </Box>
            <Progress/> {/* 실제 ProgressPage 컴포넌트 삽입 */}
        </Paper>
    );
}

function QuizPage({onClose}) {
    return (
        <Paper sx={{p: 2, mb: 2, bgcolor: '#fff9c4'}}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button size="small" onClick={onClose}>닫기</Button>
            </Box>
            <Quiz/> {/* 실제 QuizPage 컴포넌트 삽입 */}
        </Paper>
    );
}

function TutorPage({onClose}) {
    return (
        <Paper sx={{p: 2, mb: 2, bgcolor: '#ffe0b2'}}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
            </Box>
            <Tutors/> {/* 실제 Tutors 컴포넌트 삽입 */}
        </Paper>
    );
}

function RewordShop({onClose}) {
    return (
        <Paper sx={{p: 2, mb: 2, bgcolor: '#c8e6c9'}}>
            <sBox display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">보상 상점</Typography>
                <Button size="small" onClick={onClose}>닫기</Button>
            </sBox>
            <Typography>여기에 보상 상점 내용</Typography>
        </Paper>
    );
}

const TTORO_EMOJI = "🧸";
const USER_EMOJI = "🌟";
const TTORO_IMG = "/ttoro_emoji.png";

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
    const [showProgress, setShowProgress] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showTutor, setShowTutor] = useState(false);
    const [showRewordShop, setShowRewordShop] = useState(false);

    const listRef = useRef(null);
    const {setShowConfetti} = useContext(ConfettiContext);

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
            setUserName('사용자');
        }
    }, []);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, showProgress, showQuiz, showTutor, showRewordShop]);

    const triggerConfettiIfNeeded = (text) => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const sessionId = localStorage.getItem('chatbot-session');
        setMessages((prev) => [...prev, {sender: 'user', text: input}]);
        const userMessage = input;
        setInput('');
        try {
            const response = await fetch('http://localhost:55500/chat/support/bot', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({sessionId: sessionId, message: userMessage, studentId: userInfo.studentId}),
            });
            if (response.ok) {
                const data = await response.json();
                data.reply = data.reply.replace(/\\n/g, ' ');
                setMessages((prev) => [
                    ...prev,
                    {sender: '또로', text: data.reply}
                ]);
                triggerConfettiIfNeeded(data.reply);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {sender: '또로', text: '서버에서 오류가 발생했습니다.'}
                ]);
            }
        } catch (e) {
            console.error('handleSend 네트워크 오류:', e);
            setMessages((prev) => [
                ...prev,
                {sender: '또로', text: '네트워크 오류가 발생했습니다.'}
            ]);
        }
    };

    const handleLinkClick = (url) => {
        window.location.href = url.startsWith('http') ? url : `http://${url}`;
    };

    return (
        <div className="chatbot-background">
            <Box sx={{mt: 5, mx: 5 , display: "flex", justifyContent: "flex-end"}}>
                <LogoutButton/>
            </Box>
            <div className="chatbot-inside">
                {/*<Box sx={{width: '100%', maxWidth: 800, height: '100%'}}>*/}
                {/*    <Paper*/}
                {/*        elevation={3}*/}
                {/*        sx={{*/}
                {/*            p: 2,*/}
                {/*            height: '100%',*/}
                {/*            overflowY: 'auto',*/}
                {/*            backgroundColor: 'rgba(255, 255, 255, 0.65)'*/}
                {/*        }}*/}
                {/*        ref={listRef}*/}
                {/*    >*/}
                {/*        <Box sx={{*/}
                {/*            display: 'flex',*/}
                {/*            alignItems: 'center',*/}
                {/*            mb: 2,*/}
                {/*            borderTopLeftRadius: 8,*/}
                {/*            borderTopRightRadius: 8,*/}
                {/*        }}>*/}
                {/*            <span style={{fontSize: 38, marginRight: 8}}>{TTORO_EMOJI}</span>*/}
                {/*            <Typography variant="h6" gutterBottom>또로</Typography>*/}
                {/*        </Box>*/}
                {/*        /!* 하단 버튼으로 토글되는 컴포넌트들 *!/*/}
                {/*        {showProgress && <Progress onClose={() => setShowProgress(false)}/>}*/}
                {/*        {showQuiz && <Quiz onClose={() => setShowQuiz(false)}/>}*/}
                {/*        {showTutor && <Tutors onClose={() => setShowTutor(false)}/>}*/}
                {/*        {showRewordShop && <RewordShop onClose={() => setShowRewordShop(false)}/>}*/}
                {/*        <List>*/}
                {/*            {messages.length === 0 && (*/}
                {/*                <ListItem>*/}
                {/*                    <ListItemText*/}
                {/*                        primary={`${TTORO_EMOJI} 또로랑 놀자!`}*/}
                {/*                        secondary="안녕!"*/}
                {/*                    />*/}
                {/*                </ListItem>*/}
                {/*            )}*/}
                {/*            {messages.map((msg, i) => (*/}
                {/*                <ListItem*/}
                {/*                    key={i}*/}
                {/*                    sx={{*/}
                {/*                        flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',*/}
                {/*                        alignItems: 'flex-end',*/}
                {/*                        border: 'none',*/}
                {/*                        background: 'none',*/}
                {/*                        pr: msg.sender === 'user' ? 2 : 0,*/}
                {/*                        pl: msg.sender === 'user' ? 0 : 2,*/}
                {/*                    }}*/}
                {/*                >*/}
                {/*                    <Box className={`chatbot-msg-box ${msg.sender === 'user' ? 'user' : 'ttoro'}`}>*/}
                {/*                        {msg.sender === '또로'*/}
                {/*                            ? parseMessageWithLink(msg.text, handleLinkClick)*/}
                {/*                            : msg.text}*/}
                {/*                        <Typography*/}
                {/*                            variant="caption"*/}
                {/*                            sx={{*/}
                {/*                                display: 'block',*/}
                {/*                                color: '#a1887f',*/}
                {/*                                fontWeight: 700,*/}
                {/*                                textAlign: msg.sender === 'user' ? 'right' : 'left',*/}
                {/*                                mt: 0.5,*/}
                {/*                                opacity: 0.85,*/}
                {/*                                letterSpacing: 0.5,*/}
                {/*                            }}*/}
                {/*                        >*/}
                {/*                            {msg.sender === 'user' ? (*/}
                {/*                                <>*/}
                {/*                                    {USER_EMOJI} {userName}*/}
                {/*                                </>*/}
                {/*                            ) : (*/}
                {/*                                <>*/}
                {/*                                    <img src={TTORO_IMG} alt="또로" style={{*/}
                {/*                                        width: 24,*/}
                {/*                                        height: 24,*/}
                {/*                                        verticalAlign: 'middle',*/}
                {/*                                        marginRight: 4*/}
                {/*                                    }}/>*/}
                {/*                                    또로*/}
                {/*                                </>*/}
                {/*                            )}*/}
                {/*                        </Typography>*/}
                {/*                    </Box>*/}
                {/*                </ListItem>*/}
                {/*            ))}*/}
                {/*        </List>*/}
                {/*    </Paper>*/}
                {/*    <Box sx={{display: 'flex', mt: 1}}>*/}
                {/*        <TextField*/}
                {/*            fullWidth*/}
                {/*            size="small"*/}
                {/*            placeholder="메시지를 입력하세요..."*/}
                {/*            value={input}*/}
                {/*            onChange={(e) => setInput(e.target.value)}*/}
                {/*            onKeyDown={(e) => {*/}
                {/*                if (e.key === 'Enter') {*/}
                {/*                    e.preventDefault();*/}
                {/*                    handleSend();*/}
                {/*                }*/}
                {/*            }}*/}
                {/*        />*/}
                {/*        <IconButton onClick={handleSend} color="primary">*/}
                {/*            <SendIcon/>*/}
                {/*        </IconButton>*/}
                {/*    </Box>*/}
                {/*</Box>*/}
                {/*<Box sx={{width: '100%', maxWidth: 800, height: '100%'}}>*/}
                <Box sx={{height: '100%'}}>
                    <ChatPage />
                </Box>
            </div>
            <div className="ttoro-walk-img-wrapper">
                <img src={walkTtoro} alt="걷는 또로"/>
            </div>
            {/* 하단 버튼 4개 */}
            {/*<Box*/}
            {/*    sx={{*/}
            {/*        position: 'fixed',*/}
            {/*        bottom: 100,*/}
            {/*        left: '50%',*/}
            {/*        transform: 'translateX(-50%)',*/}
            {/*        zIndex: 1300,*/}
            {/*        display: 'flex',*/}
            {/*        justifyContent: 'center',*/}
            {/*        gap: 1,*/}
            {/*    }}*/}
            {/*>*/}
                {/*<Button*/}
                {/*    onClick={() => setShowProgress((prev) => !prev)}*/}
                {/*    sx={{bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 700}}*/}
                {/*>*/}
                {/*    진도 보기*/}
                {/*</Button>*/}
                {/*<Button*/}
                {/*    onClick={() => setShowQuiz((prev) => !prev)}*/}
                {/*    sx={{bgcolor: '#fff9c4', color: '#bfa000', fontWeight: 700}}*/}
                {/*>*/}
                {/*    퀴즈 보기*/}
                {/*</Button>*/}
                {/*<Button*/}
                {/*    onClick={() => setShowTutor((prev) => !prev)}*/}
                {/*    sx={{bgcolor: '#ffe0b2', color: '#e65100', fontWeight: 700}}*/}
                {/*>*/}
                {/*    튜터 보기*/}
                {/*</Button>*/}
                {/*<Button*/}
                {/*    onClick={() => setShowRewordShop((prev) => !prev)}*/}
                {/*    sx={{bgcolor: '#c8e6c9', color: '#388e3c', fontWeight: 700}}*/}
                {/*>*/}
                {/*    보상 보기*/}
                {/*</Button>*/}
            {/*</Box>*/}
        </div>
    );
}

export default TtoroChat2;