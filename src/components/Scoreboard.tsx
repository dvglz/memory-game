import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ScoreboardProps {
  isCompact?: boolean;
}

export const Scoreboard = ({ isCompact = false }: ScoreboardProps) => {
  const { players, currentPlayerIndex, timer, timerConfig, status } = useGameStore();

  return (
    <div className={`flex flex-col gap-4 md:gap-6 ${isCompact ? 'w-24 md:w-64' : 'w-48 lg:w-64'}`}>
      {players.map((player, index) => {
        const isActive = index === currentPlayerIndex && status === 'playing';
        return (
          <div 
            key={player.id}
            className={`relative p-3 lg:p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
              isActive 
                ? 'border-nba-orange shadow-[0_0_20px_rgba(255,69,0,0.3)] scale-105 z-10' 
                : 'bg-zinc-900 border-zinc-800 opacity-60'
            }`}
          >
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timer / timerConfig) * 100}%` }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-nba-red z-0"
                  transition={{ 
                    width: { 
                      duration: timer === timerConfig ? 0.2 : 1, 
                      ease: timer === timerConfig ? "easeOut" : "linear" 
                    },
                    opacity: { duration: 0.2 }
                  }}
                />
              )}
            </AnimatePresence>

            <div className="relative z-10">
              <div className="text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 text-white/70">
                {isCompact ? `P${player.id}` : player.name}
              </div>
              <div className="text-2xl lg:text-5xl font-black italic tracking-tighter">
                {player.score}
              </div>
              
              {isActive && !isCompact && (
                <div className="absolute -top-3 -right-3 bg-nba-orange text-white px-2 py-1 rounded text-[10px] font-black uppercase italic shadow-lg">
                  Active Turn
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

