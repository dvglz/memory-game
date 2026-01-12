import { useGameStore } from '../store/useGameStore';
import { THEMES } from '../config/gameConfig';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ThemeModal } from './ThemeModal';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const TopBar = () => {
  const { 
    theme, 
    timer, 
    currentPlayerIndex, 
    status,
    players,
    resetToIdle
  } = useGameStore();
  
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  const currentTheme = THEMES[theme];
  const p1 = players[0];
  const p2 = players[1];
  const isPlaying = status === 'playing';

  // Calculate progress for the timer bar (0 to 1)
  const timerConfig = useGameStore.getState().timerConfig || 15;
  const timerProgress = timer / timerConfig;

  return (
    <>
      <div className="w-full flex items-center justify-between px-3 md:px-6 py-1.5 md:py-2 bg-zinc-950/50 backdrop-blur-md border-b border-white/5 flex-shrink-0 z-[100] relative">
        {/* Left: Logo */}
        <button 
          onClick={resetToIdle}
          className="flex items-center gap-2 group flex-shrink-0 z-10"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-nba-red rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:scale-105 transition-transform">
            <span className="text-white font-black italic text-lg md:text-xl">M</span>
          </div>
          {!isMobile && (
            <div className="flex flex-col items-start leading-none">
              <span className="text-white font-black italic text-sm uppercase tracking-tighter">
                Miss Match
              </span>
            </div>
          )}
        </button>

        {/* Center: P1 Score | Clock | P2 Score */}
        <div className="flex items-center gap-3 md:gap-6 relative z-10">
          {/* Player 1 Area */}
          <div className={`flex flex-col items-center w-[80px] md:w-[120px] relative pb-1.5 pt-0.5 transition-all rounded-lg ${
            isPlaying && currentPlayerIndex === 0 ? 'bg-white/10' : ''
          }`}>
            {/* Timer Line P1 */}
            {isPlaying && currentPlayerIndex === 0 && (
              <div 
                className={`absolute bottom-0 right-0 h-0.5 bg-nba-red transition-all ease-linear rounded-bl-lg ${
                  timer === timerConfig ? 'duration-150' : 'duration-1000'
                }`}
                style={{ width: `${timerProgress * 100}%` }}
              />
            )}
            
            <span className="text-[10px] md:text-xs text-zinc-500 font-black uppercase tracking-wider">P1</span>
            <div className="flex items-center justify-center w-full relative h-6 md:h-8">
              <span className="text-xl md:text-2xl font-black italic text-white tabular-nums">
                {p1?.score ?? 0}
              </span>
              <div className="absolute right-1 md:right-2">
                {isPlaying && currentPlayerIndex === 0 && (
                  <span className="text-white text-sm md:text-lg animate-in fade-in slide-in-from-left-2">◀</span>
                )}
              </div>
            </div>
          </div>

          {/* Clock */}
          <div className="flex flex-col items-center px-1">
            <span 
              className={`text-2xl md:text-4xl font-black italic tracking-tighter tabular-nums ${
                timer <= 5 ? 'text-nba-red animate-pulse' : 'text-white'
              }`}
            >
              {timer.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Player 2 Area */}
          <div className={`flex flex-col items-center w-[80px] md:w-[120px] relative pb-1.5 pt-0.5 transition-all rounded-lg ${
            isPlaying && currentPlayerIndex === 1 ? 'bg-white/10' : ''
          }`}>
            {/* Timer Line P2 */}
            {isPlaying && currentPlayerIndex === 1 && (
              <div 
                className={`absolute bottom-0 left-0 h-0.5 bg-nba-red transition-all ease-linear rounded-br-lg ${
                  timer === timerConfig ? 'duration-150' : 'duration-1000'
                }`}
                style={{ width: `${timerProgress * 100}%` }}
              />
            )}

            <span className="text-[10px] md:text-xs text-zinc-500 font-black uppercase tracking-wider">P2</span>
            <div className="flex items-center justify-center w-full relative h-6 md:h-8">
              <div className="absolute left-1 md:left-2">
                {isPlaying && currentPlayerIndex === 1 && (
                  <span className="text-white text-sm md:text-lg animate-in fade-in slide-in-from-right-2">▶</span>
                )}
              </div>
              <span className="text-xl md:text-2xl font-black italic text-white tabular-nums">
                {p2?.score ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Theme Selector */}
        <button 
          onClick={() => setIsThemeModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-zinc-900 border border-white/10 rounded-xl hover:bg-zinc-800 transition-colors flex-shrink-0 z-10"
        >
          <span className="text-white font-black italic text-[10px] md:text-xs uppercase tracking-tight max-w-[60px] md:max-w-none truncate">
            {isMobile ? currentTheme.name.split(' ')[0] : currentTheme.name}
          </span>
          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-zinc-500" />
        </button>
      </div>

      <ThemeModal 
        isOpen={isThemeModalOpen} 
        onClose={() => setIsThemeModalOpen(false)} 
      />
    </>
  );
};
