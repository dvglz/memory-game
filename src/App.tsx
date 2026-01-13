import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { Board } from './components/Board';
import { VictoryOverlay } from './components/VictoryOverlay';
import { DebugPanel } from './components/DebugPanel';
import { GameEffects } from './components/GameEffects';
import { TopBar } from './components/TopBar';
import { HomeScreen } from './components/HomeScreen';
import { THEMES, ThemeId } from './config/gameConfig';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';

function GameContainer() {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();
  const { 
    status, 
    decrementTimer, 
    isPaused, 
    isPeeking, 
    theme,
    setTheme
  } = useGameStore();

  // Sync theme with URL
  useEffect(() => {
    if (themeId && THEMES[themeId as ThemeId]) {
      // Don't allow hidden themes via URL
      if (THEMES[themeId as ThemeId].hidden) {
        navigate('/nba-teams', { replace: true });
        return;
      }
      
      if (theme !== themeId) {
        setTheme(themeId as ThemeId);
      }
    } else if (themeId) {
      // Invalid theme, redirect to default
      navigate('/nba-teams', { replace: true });
    }
  }, [themeId, theme, setTheme, navigate]);

  useEffect(() => {
    let interval: number;
    if (status === 'playing' && !isPaused && !isPeeking) {
      interval = setInterval(() => {
        decrementTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, isPaused, isPeeking, decrementTimer]);

  if (status === 'idle') {
    return (
      <>
        <DebugPanel />
        <HomeScreen initialTheme={themeId as ThemeId} />
      </>
    );
  }

  return (
    <div className="h-dvh w-full bg-[#0a0a0a] flex flex-col overflow-hidden font-sans selection:bg-nba-red selection:text-white">
      <DebugPanel />
      <GameEffects />
      
      <TopBar />

      {/* Game Area */}
      <div className="flex-1 flex p-2 md:p-6 lg:p-8 items-center justify-center min-h-0 relative">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="animated-bg" />
        </div>
        
        <Board />
        <VictoryOverlay />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/:themeId" element={<GameContainer />} />
      <Route path="/" element={<Navigate to="/nba-teams" replace />} />
    </Routes>
  );
}
