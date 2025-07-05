// frontend/src/components/ChatBot.jsx

import React, { useReducer, useRef, useEffect, useContext, useState } from 'react';
import { Box, Typography, TextField, IconButton, Button, Paper, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ConfettiContext } from '../context/ConfettiContext';
import Tutors from '../pages/TutorPage';
import Quiz from './QuizPage';
import Feedback from '../pages/FeedbackPage';
import Progress from '../pages/ProgressPage';
import TutorDetailPage from '../pages/TutorDetailPage';
import RewardShop from './RewardShop.jsx';

const DOG_EMOJI = "🐶";
const USER_EMOJI = "🌟";

// 상태 초기값
const initialState = {
    messages: [],
    openedComponents: {},
    openedTutorDetails: {},
};

// useReducer로 메시지/컴포넌트 상태 관리
function reducer(state, action) {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'OPEN_COMPONENT':
            return { ...state, openedComponents: { ...state.openedComponents, [action.payload.msgIdx]: action.payload.type } };
        case 'CLOSE_COMPONENT': {
            const updated = { ...state.openedComponents };
            delete updated[action.payload];
            return { ...state, openedComponents: updated };
        }
        case 'OPEN_TUTOR_DETAIL':
            return { ...state, openedTutorDetails: { ...state.openedTutorDetails, [action.payload.msgIdx]: action.payload.tutor } };
        case 'CLOSE_TUTOR_DETAIL': {
            const updated = { ...state.openedTutorDetails };
            delete updated[action.payload];
            return { ...state, openedTutorDetails: updated };
        }
        default:
            return state;
    }
}

// 메시지 내 [텍스트](menu) → 버튼 변환 (feedback 지원)
function parseMessageWithLink(text, handleOpenComponent, msgIdx) {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
        }
        const label = match[1];
        const path = match[2];
        let type = null;
        if (path.startsWith('quiz')) type = 'quiz';
        else if (path.startsWith('progress')) type = 'progress';
        else if (path.startsWith('tutor')) type = 'tutor';
        else if (path.startsWith('reward')) type = 'reward';
        else if (path.startsWith('feedback')) type = 'feedback';
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
                onClick={() => type && handleOpenComponent(msgIdx, type)}
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

// 공통 래퍼(닫기 버튼 포함)
function ComponentWrapper({ title, children, onClose, bgcolor }) {
    return (
        <Paper sx={{ p: 2, mb: 2, bgcolor: bgcolor || '#fff' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">{title}</Typography>
                <Button size="small" onClick={onClose}>닫기</Button>
            </Box>
            {children}
        </Paper>
    );
}

// 하위 컴포넌트들
function ProgressPage({ onClose }) {
    return (
        <ComponentWrapper title="진도 현황" onClose={onClose}>
            <Progress />
        </ComponentWrapper>
    );
}
function QuizPage({ onClose, onResult, onDone }) {
    return (
        <ComponentWrapper title="퀴즈" onClose={onClose}>
            <Quiz onResult={onResult} onDone={onDone} />
        </ComponentWrapper>
    );
}
function TutorPage({ onClose, onTutorSelect }) {
    return (
        <ComponentWrapper title="튜터 목록" onClose={onClose}>
            <Tutors onTutorSelect={onTutorSelect} />
        </ComponentWrapper>
    );
}
function RewardShopPage({ onClose }) {
    return (
        <ComponentWrapper title="보상 상점" onClose={onClose}>
            <RewardShop />
        </ComponentWrapper>
    );
}
function FeedbackPage({ onClose }) {
    return (
        <ComponentWrapper title="피드백" onClose={onClose}>
            <Feedback />
        </ComponentWrapper>
    );
}

function ChatBot() {
    // useReducer로 메시지/컴포넌트 상태 통합 관리
    const [state, dispatch] = useReducer(reducer, initialState);
    const [input, setInput] = useState('');
    const [userName, setUserName] = useState('사용자');
    const [userInfo, setUserInfo] = useState({});
    const listRef = useRef(null);
    const { setShowConfetti } = useContext(ConfettiContext);

    // 사용자 정보 로드
    useEffect(() => {
        let sessionId = localStorage.getItem('chatbot-session');
        if (!sessionId) {
            sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
            localStorage.setItem('chatbot-session', sessionId);
        }
        try {
            setUserInfo(JSON.parse(localStorage.user));
            setUserName(JSON.parse(localStorage.user).name);
        } catch {
            setUserName('사용자');
        }
    }, []);

    // 메시지/컴포넌트 변경 시 스크롤 맨 아래로
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [state.messages, state.openedComponents, state.openedTutorDetails]);

    // 축하 이펙트
    const triggerConfettiIfNeeded = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    };

    // 메시지 전송
    const handleSend = async () => {
        if (!input.trim()) return;
        const sessionId = localStorage.getItem('chatbot-session');
        dispatch({ type: 'ADD_MESSAGE', payload: { sender: 'user', text: input } });
        const userMessage = input;
        setInput('');
        try {
            const response = await fetch('http://localhost:55500/chat/support/bot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, message: userMessage, studentId: userInfo.studentId }),
            });
            if (response.ok) {
                const data = await response.json();
                data.reply = data.reply.replace(/\\n/g, ' ');
                dispatch({ type: 'ADD_MESSAGE', payload: { sender: '또로핑', text: data.reply } });
                triggerConfettiIfNeeded();
            } else {
                dispatch({ type: 'ADD_MESSAGE', payload: { sender: '또로핑', text: '서버에서 오류가 발생했습니다.' } });
            }
        } catch {
            dispatch({ type: 'ADD_MESSAGE', payload: { sender: '또로핑', text: '네트워크 오류가 발생했습니다.' } });
        }
    };

    // 메시지별 버튼 클릭 시 해당 메시지에 컴포넌트 열기
    const handleOpenComponent = (msgIdx, type) => {
        dispatch({ type: 'OPEN_COMPONENT', payload: { msgIdx, type } });
    };

    // 컴포넌트 닫기
    const handleCloseComponent = (msgIdx) => {
        dispatch({ type: 'CLOSE_COMPONENT', payload: msgIdx });
        dispatch({ type: 'CLOSE_TUTOR_DETAIL', payload: msgIdx });
    };

    // 튜터 카드 클릭 시 상세 열기
    const handleTutorSelect = (msgIdx, tutor) => {
        dispatch({ type: 'OPEN_TUTOR_DETAIL', payload: { msgIdx, tutor } });
    };

    // 튜터 상세 닫기
    const handleCloseTutorDetail = (msgIdx) => {
        dispatch({ type: 'CLOSE_TUTOR_DETAIL', payload: msgIdx });
    };

    // 퀴즈 결과 리턴
    const handleQuizResult = (result) => {
        if (result.status === "success") {
            dispatch({
                type: 'ADD_MESSAGE',
                payload: {
                    sender: '또로핑',
                    text: `퀴즈 결과: ${result.questions?.explanation || "정답 확인!"} [이어풀기](quiz)`
                }
            });
        } else {
            dispatch({
                type: 'ADD_MESSAGE',
                payload: { sender: '또로핑', text: '퀴즈 결과 처리 중 오류가 발생했습니다.' }
            });
        }
    };

    // 하단 버튼 클릭 시 마지막 메시지에 컴포넌트 삽입
    const handleBottomButton = (type) => {
        if (state.messages.length === 0) return;
        dispatch({ type: 'OPEN_COMPONENT', payload: { msgIdx: state.messages.length - 1, type } });
    };

    // 렌더링 (기존 ChatBot 스타일 유지)
    return (
        <Box sx={{ position: 'relative', mx: 'auto', mt: 1 }}>
            <Paper
                elevation={6}
                sx={{
                    width: 510,
                    height: 290,
                    minHeight: 290,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 6,
                    bgcolor: '#fff8ee',
                    boxShadow: 'none',
                    border: '4px solid #ffe5b4',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* 메시지 영역 */}
                <Box
                    ref={listRef}
                    sx={{
                        flex: 1,
                        width: '90%',
                        overflowY: 'auto',
                        px: 2,
                        py: 1,
                        bgcolor: 'transparent'
                    }}
                >
                    {state.messages.length === 0 && (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8 }}>
                            {DOG_EMOJI} 또로핑이랑 얘기하자!
                        </Typography>
                    )}
                    {state.messages.map((msg, i) => (
                        <React.Fragment key={i}>
                            <Box
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
                                        ? parseMessageWithLink(msg.text, handleOpenComponent, i)
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
                                            {USER_EMOJI} {userName}
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
                            {/* 메시지별로 열리는 컴포넌트들 */}
                            {state.openedComponents[i] === 'quiz' && (
                                <Box sx={{ mt: 1 }}>
                                    <QuizPage
                                        onClose={() => handleCloseComponent(i)}
                                        onResult={handleQuizResult}
                                        onDone={() => handleCloseComponent(i)}
                                    />
                                </Box>
                            )}
                            {state.openedComponents[i] === 'progress' && (
                                <Box sx={{ mt: 1 }}>
                                    <ProgressPage onClose={() => handleCloseComponent(i)} />
                                </Box>
                            )}
                            {state.openedComponents[i] === 'tutor' && (
                                <Box sx={{ mt: 1 }}>
                                    <TutorPage
                                        onClose={() => handleCloseComponent(i)}
                                        onTutorSelect={(tutor) => handleTutorSelect(i, tutor)}
                                    />
                                </Box>
                            )}
                            {state.openedTutorDetails[i] && (
                                <Box sx={{ mt: 1 }}>
                                    <TutorDetailPage
                                        tutor={state.openedTutorDetails[i]}
                                        onClose={() => handleCloseTutorDetail(i)}
                                    />
                                </Box>
                            )}
                            {state.openedComponents[i] === 'reward' && (
                                <Box sx={{ mt: 1 }}>
                                    <RewardShopPage onClose={() => handleCloseComponent(i)} />
                                </Box>
                            )}
                            {state.openedComponents[i] === 'feedback' && (
                                <Box sx={{ mt: 1 }}>
                                    <FeedbackPage onClose={() => handleCloseComponent(i)} />
                                </Box>
                            )}
                        </React.Fragment>
                    ))}
                </Box>
                {/* 입력창 */}
                <Box
                    sx={{
                        borderTop: '1px solid #ffe5b4',
                        p: 0.7,
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5, gap: 1 }}>
                <Button onClick={() => handleBottomButton('quiz')}
                        sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 700 }}>
                    문제 풀기
                </Button>
                <Button onClick={() => handleBottomButton('progress')}
                        sx={{ bgcolor: '#c8e6c9', color: '#388e3c', fontWeight: 700 }}>
                    학습 현황
                </Button>
                <Button onClick={() => handleBottomButton('tutor')}
                        sx={{ bgcolor: '#fff9c4', color: '#bfa000', fontWeight: 700 }}>
                    튜터 보기
                </Button>
                <Button onClick={() => handleBottomButton('feedback')}
                        sx={{ bgcolor: '#e1bee7', color: '#6a1b9a', fontWeight: 700 }}>
                    피드백
                </Button>
                <Button onClick={() => handleBottomButton('reward')}
                        sx={{ bgcolor: '#ffe0b2', color: '#e65100', fontWeight: 700 }}>
                    보상 보기
                </Button>
            </Box>
        </Box>
    );
}

export default ChatBot;