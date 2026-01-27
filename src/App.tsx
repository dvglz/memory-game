import { useEffect, useRef } from 'react';
import { useGameStore } from './store/useGameStore';
import { Board } from './components/Board';
import { VictoryOverlay } from './components/VictoryOverlay';
import { DebugPanel } from './components/DebugPanel';
import { GameEffects } from './components/GameEffects';
import { TopBar } from './components/TopBar';
import { HomeScreen } from './components/HomeScreen';
import { THEMES, ThemeId } from './config/gameConfig';
import {
  Routes,
  Route,
  useParams,
  useNavigate,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { trackPageView } from './utils/analytics';

function GameContainer() {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();
  const { 
    status, 
    decrementTimer, 
    incrementSoloTime,
    isPaused, 
    isPeeking, 
    theme,
    setTheme,
    mode
  } = useGameStore();

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
    if (status === 'playing' && !isPaused && !isPeeking) {
      interval = setInterval(() => {
        if (mode === 'solo') {
          incrementSoloTime();
        } else {
          decrementTimer();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, isPaused, isPeeking, decrementTimer, incrementSoloTime, mode]);

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

function AnalyticsRouteListener() {
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    // Avoid dev StrictMode double-effect + ignore redundant emits.
    if (lastPathRef.current === path) return;
    lastPathRef.current = path;
    trackPageView(path);
  }, [location.pathname, location.search, location.hash]);

  return null;
}

export default function App() {
  return (
    <>
      <AnalyticsRouteListener />
      <Routes>
        <Route path="/:themeId" element={<GameContainer />} />
        <Route path="/" element={<Navigate to="/nba-teams" replace />} />
      </Routes>
    </>
  );
}
