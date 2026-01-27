import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users, User, ExternalLink } from 'lucide-react';
import { THEMES, ThemeId } from '../config/gameConfig';
import { useGameStore } from '../store/useGameStore';
import { useNavigate } from 'react-router-dom';

// Get visible themes only
const VISIBLE_THEMES = (Object.entries(THEMES) as [ThemeId, typeof THEMES['nba-teams']][])
  .filter(([_, config]) => !config.hidden)
  .map(([id, config]) => ({ id, name: config.name }));

interface HomeScreenProps {
  initialTheme?: ThemeId;
}

export const HomeScreen = ({ initialTheme }: HomeScreenProps) => {
  const { initGame, setTheme } = useGameStore();
  const navigate = useNavigate();
  
  // Find initial index based on URL theme
  const getInitialIndex = () => {
    if (initialTheme) {
      const idx = VISIBLE_THEMES.findIndex(t => t.id === initialTheme);
      if (idx !== -1) return idx;
    }
    return 0;
  };
  
  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);
  const [direction, setDirection] = useState(0);

  const currentTheme = VISIBLE_THEMES[currentIndex];

  // Update URL when theme changes
  useEffect(() => {
    navigate(`/${currentTheme.id}`, { replace: true });
    setTheme(currentTheme.id);
  }, [currentTheme.id, navigate, setTheme]);

  const goNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % VISIBLE_THEMES.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + VISIBLE_THEMES.length) % VISIBLE_THEMES.length);
  };

  const handleStartVersus = () => {
    initGame('1v1', { playerCount: 2 });
  };

  const handleStartSolo = () => {
    initGame('solo');
  };

  return (
    <div className="h-dvh w-full flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 gap-8 md:gap-12">
        {/* Logo */}
        <div className="w-80 md:w-[500px] lg:w-[600px]">
          <img 
            src="/assets/misc/miss-match_logo-full.webp" 
            alt="Miss Match" 
            className="w-full h-auto"
          />
        </div>

        {/* Theme Selector */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-zinc-500">
            Theme
          </span>
          
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={goPrev}
              className="p-2 md:p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="w-48 md:w-64 h-12 md:h-14 flex items-center justify-center overflow-hidden">
              <motion.div
                key={currentTheme.id}
                initial={{ x: direction * 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="text-xl md:text-2xl font-black uppercase italic tracking-tight text-white text-center whitespace-nowrap"
              >
                {currentTheme.name}
              </motion.div>
            </div>

            <button
              onClick={goNext}
              className="p-2 md:p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 md:gap-4 w-full max-w-md px-4">
          {/* Single Mode */}
          <button
            onClick={handleStartSolo}
            className="group flex-1 flex flex-col items-center gap-2 md:gap-3 p-5 md:p-6 rounded-2xl bg-zinc-900 border-2 border-zinc-800 hover:border-zinc-600 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            <User className="w-7 h-7 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
            <span className="text-sm md:text-base font-black uppercase tracking-tight text-white">Single</span>
          </button>

          {/* Local 1v1 Mode */}
          <button
            onClick={handleStartVersus}
            className="group flex-1 flex flex-col items-center gap-2 md:gap-3 p-5 md:p-6 rounded-2xl bg-gradient-to-b from-nba-red to-red-700 border-2 border-nba-orange/50 hover:border-nba-orange transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-nba-red/20"
          >
            <Users className="w-7 h-7 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
            <span className="text-sm md:text-base font-black uppercase tracking-tight text-white">Local 1v1</span>
          </button>
        </div>
      </main>

      {/* Footer - Clutch Games Promo */}
      <footer className="shrink-0 px-4 pb-6 pt-4">
        <a
          href="https://clutchpoints.com/play"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group mx-auto max-w-md"
        >
          <img 
            src="/assets/branding/clutch_minified.svg" 
            alt="Clutch" 
            className="h-4 md:h-5 opacity-70 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-xs md:text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors font-medium">
            Play more games
          </span>
          <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </a>
      </footer>
    </div>
  );
};
