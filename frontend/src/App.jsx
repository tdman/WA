import {BrowserRouter as Router} from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import TtoroChat from "./components/TtoroChat.jsx";
import TtoroChat2 from "./components/TtoroChat2.jsx";
import FloatingChat from './components/FloatingChat'; // 추가
import { ConfettiProvider } from "./context/ConfettiContext";

/**
 * App.jsx - 앱 루트 컴포넌트
 * @returns 
 */
function App() {
    return (
        <ConfettiProvider>
            <Router>
                {/*<BackgroundImage/>*/}
                {/*<TtoroChat/>*/} {/* 또로 긴거 */}
                <TtoroChat2/> {/* 또로 넓은거 */}
                <AppRoutes/>
                <FloatingChat/>
            </Router>
        </ConfettiProvider>
    );
}

export default App;