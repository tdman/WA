import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

import BackgroundImage from './components/BackgroundImage';
/**
 * App.jsx - 앱 루트 컴포넌트
 * @returns 
 */
function App() {
  return (
    <Router>
      <BackgroundImage />
      <AppRoutes />
    </Router>
  );
}

export default App;