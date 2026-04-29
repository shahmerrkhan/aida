import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Result from './pages/Result';
import Badges from './pages/Badges';
import MyPrompts from './pages/MyPrompts';
import Auth from './pages/Auth';
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  componentDidCatch(error, info) {
    console.error('APP CRASHED:', error, info);
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return <div style={{padding: '20px', color: 'red'}}>
        <h2>Crash: {this.state.error.message}</h2>
        <pre>{this.state.error.stack}</pre>
      </div>;
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}