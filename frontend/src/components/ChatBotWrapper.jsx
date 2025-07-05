import React from 'react';
import Box from '@mui/material/Box';
import ChatBot from './ChatBot';
import dogMouthImg from '../assets/ttoro_wide3.png'; // 강아지 입 이미지

function ChatBotWrapper() {
    return (
        <Box
            sx={{
                width: 500,
                height: 600,
                mx: 'auto',
                mt: 4,
                position: 'relative',
                backgroundImage: `url(${dogMouthImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <ChatBot />
        </Box>
    );
}

export default ChatBotWrapper;