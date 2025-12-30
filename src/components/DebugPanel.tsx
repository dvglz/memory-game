import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { THEMES, PAIR_PRESETS, ThemeId } from '../config/gameConfig';
import { Settings, X, Pause, Play, Eye, Timer, RefreshCw, Layers } from 'lucide-react';

export const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    status,
    isPaused, 
    isPeeking, 
    showJerseyColors,
    jokerEnabled,
    theme, 
    timerConfig,
    flipDelayConfig,
    isTiebreaker,
    togglePause, 
    peekCards, 
    toggleJerseyColors,
    setJokerEnabled,
    setTimerConfig, 
    setFlipDelayConfig,
    setTheme, 
    initGame 
  } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`') {
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] w-80 bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans">
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
            {(Object.keys(THEMES) as ThemeId[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
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

        {/* Game Config */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500">Grid Presets (Main Game)</label>
          <div className="grid grid-cols-3 gap-2">
            {PAIR_PRESETS.map((p) => (
              <button
                key={p.pairs}
                onClick={() => initGame(undefined, { pairs: p.pairs, columns: p.columns })}
                disabled={isTiebreaker}
                className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1"
              >
                <span>{p.pairs} Pairs</span>
                <span className="text-[9px] opacity-50">{p.columns}x{p.pairs*2/p.columns}</span>
              </button>
            ))}
          </div>
        </div>

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
              className="flex items-center justify-center gap-2 px-3 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all border border-white/5"
            >
              <Eye className="w-3 h-3" />
              Peek (5s)
            </button>
          </div>
          <button
            onClick={toggleJerseyColors}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
              showJerseyColors 
                ? 'bg-nba-red/10 border-nba-red text-nba-red' 
                : 'bg-zinc-900 border-white/5 text-zinc-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3 h-3" />
              <span>Jersey Colors</span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${showJerseyColors ? 'bg-nba-red' : 'bg-zinc-700'}`}>
              <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${showJerseyColors ? 'right-1' : 'left-1'}`} />
            </div>
          </button>

          <button
            onClick={() => setJokerEnabled(!jokerEnabled)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
              jokerEnabled 
                ? 'bg-nba-orange/10 border-nba-orange text-nba-orange' 
                : 'bg-zinc-900 border-white/5 text-zinc-500'
            }`}
            title="Adds 2 trap cards. Flip one = skip your turn!"
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
          </div>
        </div>
      </div>

      <div className="p-3 bg-black/40 text-[9px] text-center text-zinc-600 font-bold uppercase tracking-widest">
        Press ` to toggle this menu
      </div>
    </div>
  );
};
