import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Result from './pages/Result';
import Badges from './pages/Badges';
import MyPrompts from './pages/MyPrompts';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/result" element={<Result />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/my-prompts" element={<MyPrompts />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}