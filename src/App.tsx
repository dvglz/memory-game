import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { Board } from './components/Board';
import { Scoreboard } from './components/Scoreboard';
import { VictoryOverlay } from './components/VictoryOverlay';
import { DebugPanel } from './components/DebugPanel';
import { THEMES } from './config/gameConfig';
import { Play } from 'lucide-react';

function App() {
  const { 
    status, 
    initGame, 
    decrementTimer, 
    matchedPairs, 
    cards, 
    isPaused, 
    isPeeking, 
    theme 
  } = useGameStore();

  useEffect(() => {
    let interval: number;
    if (status === 'playing' && !isPaused && !isPeeking) {
      interval = setInterval(() => {
        decrementTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, isPaused, isPeeking, decrementTimer]);

  const currentTheme = THEMES[theme];

  if (status === 'idle') {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden p-8">
        <DebugPanel />
        <div className="max-w-4xl w-full text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-[120px] font-black italic tracking-tighter leading-none uppercase text-white">
              {theme.split('_')[0].toUpperCase()} <span className="text-nba-red">Memory</span> Match
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xl">Official Clutch Creator MVP</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button 
              onClick={() => initGame('1v1')}
              className="group relative bg-zinc-900 border-2 border-zinc-800 p-8 rounded-2xl transition-all hover:border-nba-red hover:bg-zinc-800/50"
            >
              <Play className="w-12 h-12 text-nba-red mb-4 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-black uppercase italic italic">1v1 Mode</div>
              <div className="text-zinc-500 text-sm font-bold uppercase tracking-wider">Local Multiplayer</div>
            </button>

            <button 
              onClick={() => initGame('solo')}
              className="group relative bg-zinc-900 border-2 border-zinc-800 p-8 rounded-2xl transition-all hover:border-nba-orange hover:bg-zinc-800/50"
            >
              <Play className="w-12 h-12 text-nba-orange mb-4 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-black uppercase italic italic">Solo Mode</div>
              <div className="text-zinc-500 text-sm font-bold uppercase tracking-wider">High Score Run</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-8 overflow-hidden font-sans selection:bg-nba-red selection:text-white">
      <DebugPanel />
      
      {/* 16:9 Broadcast Container */}
      <div className="relative w-full max-w-[1920px] aspect-video flex gap-8 items-center justify-center">
        
        {/* Left Scoreboard (Player 1) */}
        <div className="flex-shrink-0">
          <Scoreboard />
        </div>

        {/* Center Board (1:1 ratio) */}
        <div className="flex-grow flex justify-center items-center">
          <Board />
        </div>

        {/* Right Info (Game Stats / Player 2 info) */}
        <div className="flex-shrink-0 w-64 space-y-6">
          <div className="bg-zinc-900/80 backdrop-blur border border-white/5 p-6 rounded-xl">
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-4">Broadcast Feed</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400 font-bold uppercase">Game Status</span>
                <span className="text-nba-orange font-black uppercase italic">
                  {isPaused ? 'Paused' : isPeeking ? 'Peeking' : status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400 font-bold uppercase">Matched</span>
                <span className="text-white font-black italic">{matchedPairs}/{cards.length / 2}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400 font-bold uppercase">Theme</span>
                <span className="text-white font-black italic text-[10px]">{currentTheme.name}</span>
              </div>
            </div>
          </div>
          
          <img 
            src="/assets/branding/clutch_minified.svg" 
            alt="Logo" 
            className="w-32 mx-auto opacity-20 grayscale brightness-200"
          />
        </div>

        <VictoryOverlay />
      </div>
    </div>
  );
}

export default App;
