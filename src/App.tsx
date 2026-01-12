import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { Board } from './components/Board';
import { VictoryOverlay } from './components/VictoryOverlay';
import { DebugPanel } from './components/DebugPanel';
import { GameEffects } from './components/GameEffects';
import { TopBar } from './components/TopBar';
import { THEMES, ThemeId } from './config/gameConfig';
import { Users } from 'lucide-react';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';

function GameContainer() {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();
  const { 
    status, 
    initGame, 
    decrementTimer, 
    isPaused, 
    isPeeking, 
    theme,
    setTheme
  } = useGameStore();

  // Sync theme with URL
  useEffect(() => {
    if (themeId && THEMES[themeId as ThemeId]) {
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
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden p-8">
        <DebugPanel />
        <div className="max-w-4xl w-full text-center space-y-12">
          <div className="space-y-2">
            <h1 className="text-7xl md:text-[120px] font-black italic tracking-tighter leading-none uppercase text-white">
              Miss Match
            </h1>
            <div className="text-nba-red text-2xl md:text-5xl font-black italic uppercase tracking-tighter">
              {THEMES[theme].name}
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={() => initGame('1v1', { playerCount: 2 })}
              className="group relative bg-zinc-900 border-2 border-zinc-800 p-8 md:p-10 rounded-3xl transition-all hover:border-nba-red hover:bg-zinc-800/50 w-full max-w-sm"
            >
              <Users className="w-12 h-12 md:w-16 md:h-16 text-nba-red mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-2xl md:text-3xl font-black uppercase italic">Versus Mode</div>
              <div className="text-zinc-500 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] mt-2">1v1 Local Multiplayer</div>
            </button>
          </div>
        </div>
      </div>
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
        <div className="absolute inset-0 animated-bg opacity-20 pointer-events-none" />
        
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
