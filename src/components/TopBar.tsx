import { useGameStore } from '../store/useGameStore';
import { THEMES, GAME_CONFIG } from '../config/gameConfig';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ThemeModal } from './ThemeModal';
import { useMediaQuery } from '../hooks/useMediaQuery';

// Circular timer component (full circle, outside the timer text)
const CircularTimer = ({ progress, size = 80, isReset }: { progress: number; size?: number; isReset: boolean }) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className="absolute -rotate-90">
      {/* Background circle (dark) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle (red) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#ef4444"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: isReset ? 'stroke-dashoffset 150ms ease-out' : 'stroke-dashoffset 1000ms linear' }}
      />
    </svg>
  );
};

// Score display with bounce animation
const AnimatedScore = ({ score }: { score: number }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      setIsAnimating(true);
      prevScore.current = score;
      const timeout = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [score]);

  return (
    <span 
      className={`text-5xl md:text-[3rem] font-black italic text-white tabular-nums transition-transform duration-300 ${
        isAnimating ? 'scale-125' : 'scale-100'
      }`}
    >
      {score}
    </span>
  );
};

export const TopBar = () => {
  const { 
    theme, 
    timer, 
    currentPlayerIndex, 
    status,
    players,
    resetToIdle,
    timerConfig,
    mode,
    cards,
    matchedPairs,
    jokerEnabled,
    soloElapsedTime
  } = useGameStore();
  
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  const currentTheme = THEMES[theme];
  const p1 = players[0];
  const p2 = players[1];
  const isPlaying = status === 'playing';
  const timerProgress = timer / timerConfig;
  const isSolo = mode === 'solo';

  const totalPairs = (cards.length - (jokerEnabled ? 2 : 0)) / 2;

  return (
    <>
      <div className="w-full flex items-center justify-between px-3 md:px-6 h-[72px] md:h-[96px] bg-zinc-950/50 backdrop-blur-md border-b border-white/5 flex-shrink-0 z-[100] relative">
        {/* Left: Logo */}
        <button 
          onClick={resetToIdle}
          className="flex items-center gap-2 group flex-shrink-0 z-10"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-nba-red rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:scale-105 transition-transform overflow-hidden">
            <img 
              src="/assets/misc/miss-match-logo_min.svg" 
              alt="Miss Match" 
              className="w-5 h-5 md:w-6 md:h-6"
            />
          </div>
          {!isMobile && (
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-wide">
              Miss Match
            </span>
          )}
        </button>

        {/* Center Section */}
        <div className="flex items-center gap-2 md:gap-6 relative z-10">
          {isSolo ? (
            (() => {
              const moves = p1?.stats.totalMoves ?? 0;
              const remainingPairs = totalPairs - matchedPairs;
              const goldBudget = GAME_CONFIG.solo.goldThreshold - moves;
              const silverBudget = GAME_CONFIG.solo.silverThreshold - moves;
              
              // Format elapsed time as MM:SS
              const minutes = Math.floor(soloElapsedTime / 60);
              const seconds = soloElapsedTime % 60;
              const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
              
              // Determine tier message
              let tierMessage = '';
              let tierColor = 'text-zinc-500';
              if (goldBudget >= remainingPairs) {
                tierMessage = `FINISH IN ${goldBudget} FOR GOLD`;
                tierColor = 'text-yellow-400';
              } else if (silverBudget >= remainingPairs) {
                tierMessage = `FINISH IN ${silverBudget} FOR SILVER`;
                tierColor = 'text-zinc-300';
              } else {
                tierMessage = 'NO MEDAL';
                tierColor = 'text-zinc-600';
              }
              
              return (
                <div className="flex flex-col items-center gap-1">
                  {/* Stats Row */}
                  <div className="flex items-center gap-6 md:gap-12">
                    {/* Pairs */}
                    <div className="flex flex-col items-center">
                      <span className="text-2xl md:text-4xl font-black italic text-white tabular-nums">
                        {matchedPairs}/{totalPairs}
                      </span>
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/50">
                        Pairs
                      </span>
                    </div>
                    
                    {/* Moves */}
                    <div className="flex flex-col items-center">
                      <span className="text-2xl md:text-4xl font-black italic text-white tabular-nums">
                        {moves}
                      </span>
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/50">
                        Moves
                      </span>
                    </div>
                    
                    {/* Time Spent */}
                    <div className="flex flex-col items-center">
                      <span className="text-2xl md:text-4xl font-black italic text-white tabular-nums">
                        {timeDisplay}
                      </span>
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/50">
                        Spent
                      </span>
                    </div>
                  </div>
                  
                  {/* Tier Message */}
                  <div className={`text-[10px] md:text-sm font-black uppercase italic tracking-wider ${tierColor}`}>
                    {tierMessage}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="flex items-center gap-2 md:gap-6 relative">
              {/* Player 1 Area - right aligned */}
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex flex-col items-end min-w-[60px] md:min-w-[100px]">
                  <span className={`text-[10px] md:text-xs font-black italic uppercase tracking-wider ${
                    isPlaying && currentPlayerIndex === 0 ? 'text-nba-red' : 'text-zinc-500'
                  }`}>
                    {isMobile ? 'P1' : 'PLAYER 1'}
                  </span>
                  <AnimatedScore score={p1?.score ?? 0} />
                </div>
                {/* Turn Arrow P1 */}
                <div className="w-4 md:w-6 flex justify-center">
                  {isPlaying && currentPlayerIndex === 0 && (
                    <span className="text-nba-red text-lg md:text-2xl animate-pulse">◀</span>
                  )}
                </div>
              </div>

              {/* Circular Timer */}
              <div className="relative flex items-center justify-center" style={{ width: isMobile ? 60 : 80, height: isMobile ? 60 : 80 }}>
                <CircularTimer progress={timerProgress} size={isMobile ? 60 : 80} isReset={timer === timerConfig} />
                <div className="flex flex-col items-center justify-center z-10">
                  <span 
                    className={`text-base md:text-[1.5rem] font-black italic tracking-tighter tabular-nums leading-none ${
                      timer <= 5 ? 'text-nba-red animate-pulse' : 'text-white'
                    }`}
                  >
                    :{timer.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[8px] md:text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                    time left
                  </span>
                </div>
              </div>

              {/* Player 2 Area - left aligned */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Turn Arrow P2 */}
                <div className="w-4 md:w-6 flex justify-center">
                  {isPlaying && currentPlayerIndex === 1 && (
                    <span className="text-nba-red text-lg md:text-2xl animate-pulse">▶</span>
                  )}
                </div>
                <div className="flex flex-col items-start min-w-[60px] md:min-w-[100px]">
                  <span className={`text-[10px] md:text-xs font-black italic uppercase tracking-wider ${
                    isPlaying && currentPlayerIndex === 1 ? 'text-nba-red' : 'text-zinc-500'
                  }`}>
                    {isMobile ? 'P2' : 'PLAYER 2'}
                  </span>
                  <AnimatedScore score={p2?.score ?? 0} />
                </div>
              </div>
            </div>
          )}
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
