import { useEffect, useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { Board } from './components/Board';
import { VictoryOverlay } from './components/VictoryOverlay';
import { DebugPanel } from './components/DebugPanel';
import { GameEffects } from './components/GameEffects';
import { TopBar } from './components/TopBar';
import { HomeScreen } from './components/HomeScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { THEMES, ThemeId } from './config/gameConfig';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useMultiplayer } from './multiplayer';

function GameContainer() {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();
  const [showLobby, setShowLobby] = useState(false);
  
  const { 
    status, 
    decrementTimer, 
    isPaused, 
    isPeeking, 
    theme,
    setTheme,
    isOnline,
    syncFromServer,
  } = useGameStore();

  const multiplayer = useMultiplayer();

  // Sync multiplayer state to store
  useEffect(() => {
    if (multiplayer.roomState && (multiplayer.roomState.status === 'playing' || multiplayer.roomState.status === 'finished')) {
      syncFromServer(multiplayer.roomState);
    }
  }, [multiplayer.roomState, syncFromServer]);

  // Fix mobile viewport offset when returning to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

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
    if (status === 'playing' && !isPaused && !isPeeking && !isOnline) {
      interval = setInterval(() => {
        decrementTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, isPaused, isPeeking, decrementTimer, isOnline]);

  // Lobby screen
  if (showLobby) {
    return (
      <LobbyScreen 
        onBack={() => {
          multiplayer.disconnect();
          setShowLobby(false);
        }}
        onGameStart={() => {
          setShowLobby(false);
        }}
        multiplayer={multiplayer}
      />
    );
  }

  if (status === 'idle') {
    return (
      <>
        <DebugPanel />
        <HomeScreen 
          initialTheme={themeId as ThemeId} 
          onPlayOnline={() => setShowLobby(true)}
        />
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
