import { AuthProvider } from './context/AuthContext';
import { XPProvider } from './context/XPContext';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Result from './pages/Result';
import Badges from './pages/Badges';
import MyPrompts from './pages/MyPrompts';
import Auth from './pages/Auth';

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
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </XPProvider>
  </AuthProvider>
  );
  }