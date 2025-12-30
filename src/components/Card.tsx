import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType } from '../types/game';
import { GAME_CONFIG, THEMES } from '../config/gameConfig';
import { NBA_TEAMS, NFL_TEAMS } from '../data/teams';
import { useGameStore } from '../store/useGameStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from 'react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  card: CardType;
  onClick: () => void;
  isProcessing: boolean;
}

export const Card = ({ card, onClick, isProcessing }: CardProps) => {
  const { theme, showJerseyColors } = useGameStore();
  const themePath = THEMES[theme].path;
  const [showTrapEffect, setShowTrapEffect] = useState(false);

  // Trigger trap effect when joker is revealed
  useEffect(() => {
    if (card.isJoker && card.isFlipped && !card.isMatched) {
      setShowTrapEffect(true);
      const timer = setTimeout(() => setShowTrapEffect(false), 800);
      return () => clearTimeout(timer);
    }
  }, [card.isFlipped, card.isJoker, card.isMatched]);

  // Get primary color if jersey colors are enabled
  const getBackgroundColor = () => {
    if (card.isJoker) return '#18181b'; // zinc-900
    if (!showJerseyColors) return '#ffffff';
    
    if (theme === 'bron_mode') return '#552583'; // Lakers purple
    
    const teamKey = card.face.split('_')[1];
    if (theme === 'nba_teams') {
      return NBA_TEAMS[teamKey]?.colors.primary || '#ffffff';
    } else if (theme === 'nfl_teams') {
      return NFL_TEAMS[teamKey]?.colors.primary || '#ffffff';
    }
    return '#ffffff';
  };

  const backgroundColor = getBackgroundColor();

  return (
    <div 
      className="relative w-full aspect-[3/4] cursor-pointer"
      onClick={() => !card.isFlipped && !card.isMatched && !isProcessing && onClick()}
    >
      {/* Trap shockwave effect */}
      <AnimatePresence>
        {showTrapEffect && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-lg border-2 border-red-500 pointer-events-none"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: i * 0.1,
                  ease: "easeOut" 
                }}
              />
            ))}
            <motion.div
              className="absolute inset-0 rounded-lg bg-red-500 pointer-events-none z-10"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ 
          rotateY: card.isFlipped || card.isMatched ? 180 : 0,
          x: showTrapEffect ? [0, -8, 8, -8, 8, -4, 4, 0] : 0,
          y: showTrapEffect ? [0, -4, 4, -4, 4, 0] : 0
        }}
        transition={{ 
          rotateY: { duration: 0.4, type: 'spring', stiffness: 260, damping: 20 },
          x: { duration: 0.4, ease: "easeInOut" },
          y: { duration: 0.4, ease: "easeInOut" }
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front (Hidden) */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg border-2 border-white/10 bg-zinc-900 flex items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img 
            src={GAME_CONFIG.assets.back} 
            alt="Clutch Branding" 
            className="w-2/3 h-2/3 object-contain opacity-40"
          />
        </div>

        {/* Back (Face Up) */}
        <motion.div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden rounded-lg border-2 flex items-center justify-center overflow-hidden",
            theme !== 'bron_mode' && "p-2",
            card.isMatched ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : 
            card.isJoker ? "border-red-500" : "border-white"
          )}
          animate={{
            boxShadow: card.isJoker && card.isFlipped 
              ? ["0 0 15px rgba(239,68,68,0.5)", "0 0 30px rgba(239,68,68,0.8)", "0 0 15px rgba(239,68,68,0.5)"]
              : "none"
          }}
          transition={{ 
            boxShadow: { duration: 0.8, repeat: card.isFlipped && !card.isMatched ? Infinity : 0 }
          }}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: backgroundColor
          }}
        >
          {card.isJoker ? (
            <motion.div className="relative flex items-center justify-center">
              <motion.span 
                className="text-4xl sm:text-6xl select-none relative z-10"
                animate={card.isFlipped ? {
                  scale: [0.5, 1.5, 1],
                  rotate: [0, -15, 15, -10, 10, 0]
                } : {}}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {card.face}
              </motion.span>
              {/* Danger pulse rings behind emoji */}
              {card.isFlipped && (
                <motion.div
                  className="absolute w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-red-500/20"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          ) : (
            <img 
              src={`${themePath}${card.face}.${theme === 'bron_mode' ? 'jpg' : 'png'}`} 
              alt={card.face} 
              className={cn(
                "w-full h-full brightness-[1.1] drop-shadow-sm",
                theme === 'bron_mode' ? "object-cover" : "object-contain"
              )}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
