import { AuthProvider } from './context/AuthContext';
import { XPProvider } from './context/XPContext';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Result from './pages/Result';
import Badges from './pages/Badges';
import FeedbackWidget from './components/FeedbackWidget';
import MyPrompts from './pages/MyPrompts';
import Auth from './pages/Auth';
import Templates from './pages/Templates';


export default function App() {
  return (
  <AuthProvider>
    <XPProvider>
      <ThemeProvider>
        <BrowserRouter 
          future={{ 
            v7_startTransition: true, 
            v7_relativeSplatPath: true 
          }}
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/result" element={<Result />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/my-prompts" element={<MyPrompts />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/templates" element={<Templates />} />
          </Routes>
          <FeedbackWidget />
        </BrowserRouter>
      </ThemeProvider>
    </XPProvider>
  </AuthProvider>
  );
  }