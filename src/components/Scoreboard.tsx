import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Scoreboard = () => {
  const { players, currentPlayerIndex, timer, status } = useGameStore();

  return (
    <div className="flex flex-col gap-6 w-64">
      {players.map((player, index) => {
        const isActive = index === currentPlayerIndex && status === 'playing';
        return (
          <div 
            key={player.id}
            className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
              isActive 
                ? 'bg-nba-red border-nba-orange shadow-[0_0_30px_rgba(255,69,0,0.3)] scale-105 z-10' 
                : 'bg-zinc-900 border-zinc-800 opacity-60'
            }`}
          >
            <div className="text-xs font-black uppercase tracking-widest mb-1 text-white/70">
              {player.name}
            </div>
            <div className="text-5xl font-black italic tracking-tighter italic">
              {player.score}
            </div>
            
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timer / 15) * 100}%` }}
                  className="absolute bottom-0 left-0 h-1 bg-white"
                />
              )}
            </AnimatePresence>

            {isActive && (
              <div className="absolute -top-3 -right-3 bg-nba-orange text-white px-2 py-1 rounded text-[10px] font-black uppercase italic">
                Active Turn
              </div>
            )}
          </div>
        );
      })}
      
      <div className="mt-auto bg-zinc-900/50 p-4 rounded-lg border border-white/5 text-center">
        <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Shot Clock</div>
        <div className={`text-4xl font-black ${timer <= 5 ? 'text-nba-red animate-pulse' : 'text-white'}`}>
          {timer.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

