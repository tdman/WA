import React, { useState } from 'react';
import ChatBot from './ChatBot';
import { Fab, Box, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

function ChatBotFloating() {
    const [open, setOpen] = useState(false);

    // 오버레이 클릭 시 챗봇 닫기
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) setOpen(false);
    };

    return (
        <>
            {/* 플로팅 버튼 */}
            <Fab
                aria-label="chat"
                onClick={() => setOpen((prev) => !prev)}
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    zIndex: 2000,
                    background: '#bbdefb',
                    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.12)',
                    width: 72,
                    height: 72,
                    transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
                    animation: open ? 'none' : 'bounce 1.2s infinite',
                    '&:hover': {
                        background: '#3d6690',
                        transform: 'scale(1.10) rotate(-4deg)',
                        boxShadow: '0 12px 32px rgba(25, 118, 210, 0.18)',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '30px',
                }}
            >
                <Box
                    sx={{
                        bgcolor: '#fff',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
                    }}
                >
                    <ChatIcon sx={{ color: '#1976d2', fontSize: 32 }} />
                </Box>
            </Fab>
            <style>
                {`
                @keyframes bounce {
                  0%, 100% { transform: translateY(0);}
                  50% { transform: translateY(-10px);}
                }
                `}
            </style>
            <style>
                {`
@keyframes bounce {
  0%, 100% { transform: translateY(0);}
  50% { transform: translateY(-10px);}
}
`}
            </style>
            {/* 챗봇 모달 */}
            {open && (
                <Box
                    onClick={handleOverlayClick}
                    sx={{
                        position: 'fixed',
                        inset: 0,
                        bgcolor: 'rgba(0,0,0,0.15)',
                        zIndex: 2100,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            mb: 8,
                            mr: 4,
                        }}
                    >
                        {/* 닫기 버튼 */}
                        <IconButton
                            size="small"
                            onClick={() => setOpen(false)}
                            sx={{
                                position: 'absolute',
                                top: 1,
                                right: 12,
                                zIndex: 1,
                                bgcolor: 'transparent',
                                boxShadow: 'none',
                                border: 'none',
                                width: 36,
                                height: 36,
                                '&:hover': {
                                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                                },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CloseIcon sx={{ color: '#fff', fontSize: 22 }} />
                        </IconButton>
                        <ChatBot />
                    </Box>
                </Box>
            )}
        </>
    );
}

export default ChatBotFloating;