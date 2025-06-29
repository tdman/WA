import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { UserProvider } from './context/UserContext.jsx'; // ✅ 추가

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
  },
});

createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
      <UserProvider> {}
        <App />
      </UserProvider>
    </ThemeProvider>
);