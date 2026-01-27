import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { THEMES, ThemeId } from '../config/gameConfig';
import { Settings, X, Pause, Play, Eye, Timer, RefreshCw, Layers, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DebugPanel = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { 
    status,
    isPaused, 
    isPeeking, 
    jokerEnabled,
    theme, 
    timerConfig,
    flipDelayConfig,
    togglePause, 
    peekCards, 
    setJokerEnabled,
    setTimerConfig, 
    setFlipDelayConfig,
    initGame,
    debugEndGame
  } = useGameStore();

  const isBronMode = theme === 'bron-mode';

  const activateBronMode = () => {
    setJokerEnabled(false);
    navigate('/bron-mode');
    initGame(undefined, { pairs: 12, columns: 6 });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed top-24 right-4 z-[110] w-80 bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-nba-orange" />
          <span className="text-xs font-black uppercase tracking-widest text-white">Debug Control</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Theme Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500">Game Theme</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(THEMES) as ThemeId[])
              .filter(t => !THEMES[t].hidden)
              .map((t) => (
              <button
                key={t}
                onClick={() => navigate(`/${t}`)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  theme === t 
                    ? 'bg-nba-red text-white shadow-lg shadow-nba-red/20' 
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {THEMES[t].name}
              </button>
            ))}
          </div>
        </div>

        {/* Bron Mode Special */}
        {!THEMES['bron-mode'].hidden && (
          <button
            onClick={activateBronMode}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
              isBronMode 
                ? 'bg-purple-500/20 border-purple-500 text-purple-400' 
                : 'bg-zinc-900 border-white/5 text-zinc-500 hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              <div className="flex flex-col items-start text-left">
                <span>Bron Mode</span>
                <span className="text-[8px] opacity-60 font-normal">12 pairs • No traps • Expressions</span>
              </div>
            </div>
            {isBronMode && <span className="text-[9px] bg-purple-500 text-white px-2 py-0.5 rounded-full">ACTIVE</span>}
          </button>
        )}

        {/* Controls */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500">Live Controls</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={togglePause}
              disabled={status !== 'playing'}
              className="flex items-center justify-center gap-2 px-3 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all border border-white/5"
            >
              {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={peekCards}
              disabled={status !== 'playing' || isPeeking}
              className="flex items-center justify-center gap-2 px-3 py-3 w-full bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all border border-white/5"
            >
              <Eye className="w-3 h-3" />
              Peek (5s)
            </button>
          </div>

          <button
            onClick={() => setJokerEnabled(!jokerEnabled)}
            disabled={isBronMode}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
              jokerEnabled 
                ? 'bg-nba-orange/10 border-nba-orange text-nba-orange' 
                : 'bg-zinc-900 border-white/5 text-zinc-500'
            } ${isBronMode ? 'opacity-30 cursor-not-allowed' : ''}`}
            title={isBronMode ? "Not available in Bron Mode" : "Adds 2 trap cards. Flip one = skip your turn!"}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">💥</span>
              <div className="flex flex-col items-start">
                <span>Joker Mode</span>
                <span className="text-[8px] opacity-60 font-normal">Adds 2 trap cards to the board</span>
              </div>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${jokerEnabled ? 'bg-nba-orange' : 'bg-zinc-700'}`}>
              <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${jokerEnabled ? 'right-1' : 'left-1'}`} />
            </div>
          </button>
        </div>

        {/* Timer Config */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500 flex justify-between">
              Turn Timer <span>{timerConfig}s</span>
            </label>
            <div className="flex items-center gap-3">
              <Timer className="w-4 h-4 text-zinc-500" />
              <input 
                type="range" 
                min="5" 
                max="60" 
                step="5"
                value={timerConfig}
                onChange={(e) => setTimerConfig(Number(e.target.value))}
                className="flex-grow accent-nba-red"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500 flex justify-between">
              Flip Duration <span>{flipDelayConfig}ms</span>
            </label>
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-zinc-500" />
              <input 
                type="range" 
                min="200" 
                max="3000" 
                step="100"
                value={flipDelayConfig}
                onChange={(e) => setFlipDelayConfig(Number(e.target.value))}
                className="flex-grow accent-nba-orange"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 pt-2">
          <label className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500">Quick Actions</label>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => initGame()}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-100 hover:bg-white text-black rounded-lg text-xs font-black uppercase italic transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              Restart Game
            </button>
            <button
              onClick={debugEndGame}
              disabled={status === 'idle' || status === 'gameOver'}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-nba-red/10 hover:bg-nba-red/20 text-nba-red border border-nba-red/20 rounded-lg text-xs font-black uppercase italic transition-all disabled:opacity-30"
            >
              <Crown className="w-3 h-3" />
              Force End Game
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 bg-black/40 text-[9px] text-center text-zinc-600 font-bold uppercase tracking-widest">
        Press / to toggle this menu
      </div>
    </div>
  );
};
