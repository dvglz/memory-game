import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Trophy, RefreshCw, Zap } from 'lucide-react';

export const VictoryOverlay = () => {
  const { status, winner, initGame, mode } = useGameStore();

  const isVisible = ['victoryLocked', 'tiebreaker', 'gameOver'].includes(status);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="text-center p-12 max-w-lg"
        >
          {status === 'tiebreaker' ? (
            <>
              <Zap className="w-24 h-24 text-nba-orange mx-auto mb-6 animate-pulse" />
              <h2 className="text-6xl font-black italic tracking-tighter mb-4 uppercase">Overtime!</h2>
              <p className="text-zinc-400 mb-8 text-lg">The board is clear but the score is tied. Entering a 6-pair sudden death grid.</p>
              <button 
                onClick={() => initGame(mode, { isTiebreaker: true })}
                className="bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest hover:bg-nba-orange hover:text-white transition-colors flex items-center gap-2 mx-auto"
              >
                Start Tiebreaker <RefreshCw className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
              <div className="text-nba-orange font-black uppercase tracking-widest mb-2">
                {status === 'victoryLocked' ? 'Victory Secured' : 'Match Final'}
              </div>
              <h2 className="text-7xl font-black italic tracking-tighter mb-4 uppercase leading-none">
                {winner === 'tie' ? "It's a Tie!" : `${winner?.name} Wins!`}
              </h2>
              <p className="text-zinc-400 mb-8 text-lg">
                {status === 'victoryLocked' ? 'Mathematically unbeatable lead achieved.' : 'Board cleared.'}
              </p>
              <button 
                onClick={() => initGame(mode)}
                className="bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest hover:bg-nba-red hover:text-white transition-colors flex items-center gap-2 mx-auto"
              >
                Rematch <RefreshCw className="w-5 h-5" />
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

