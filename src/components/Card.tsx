import { motion } from 'framer-motion';
import { Card as CardType } from '../types/game';
import { GAME_CONFIG, THEMES } from '../config/gameConfig';
import { NBA_TEAMS, NFL_TEAMS } from '../data/teams';
import { useGameStore } from '../store/useGameStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

  // Get primary color if jersey colors are enabled
  const getBackgroundColor = () => {
    if (!showJerseyColors) return '#ffffff';
    
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
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
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
        <div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden rounded-lg border-2 flex items-center justify-center p-2",
            card.isMatched ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "border-white"
          )}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: backgroundColor
          }}
        >
          <img 
            src={`${themePath}${card.face}.png`} 
            alt={card.face} 
            className="w-full h-full object-contain brightness-[1.1] drop-shadow-sm"
          />
        </div>
      </motion.div>
    </div>
  );
};
