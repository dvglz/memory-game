import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { THEMES, GAME_CONFIG } from '../config/gameConfig';
import { RefreshCw, Target, Flame, MousePointer2, Clock, Bomb, X } from 'lucide-react';

export const VictoryOverlay = () => {
  const { status, winner, players, initGame, mode, theme, isTiebreaker, debugShowResults, toggleDebugResults, jokerEnabled } = useGameStore();

  const isVisible = ['victoryLocked', 'tiebreaker', 'gameOver'].includes(status) || debugShowResults;
  const themeName = THEMES[theme].name;

  if (!isVisible) return null;

  const winnerData = typeof winner === 'object' ? winner : null;
  const isFlawless = winnerData && players.every(p => p.id === winnerData.id || p.score === 0);
  const isAce = status === 'victoryLocked';
  const isTie = status === 'tiebreaker';

  const getVictoryTitle = () => {
    if (isTie) return "IT'S A TIE!";
    if (isTiebreaker) return "OVERTIME WIN!";
    if (isFlawless) return "FLAWLESS!";
    return "GAME OVER";
  };

  const containerVariants = {
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } }
  };

  const getTimeHighlighter = () => {
    const times = players.map(p => p.stats.timeSpent);
    const minTime = Math.min(...times);
    return minTime > 0 ? players.map((p, i) => p.stats.timeSpent === minTime ? i : -1).filter(i => i !== -1) : [];
  };

  const StatRow = ({ label, icon: Icon, values, highlightIndices = [] }: { 
    label: string, 
    icon: any, 
    values: (string | number)[],
    highlightIndices?: number[]
  }) => {
    const isThreePlayers = values.length === 3;
    
    return (
      <motion.div 
        variants={rowVariants}
        className={`grid ${isThreePlayers ? 'grid-cols-[1fr_1fr_auto_1fr]' : 'grid-cols-[1fr_auto_1fr]'} items-center py-2`}
      >
        <div className="flex gap-8 justify-end pr-6">
          <div className={`text-2xl md:text-3xl font-black italic ${highlightIndices.includes(0) ? 'text-nba-orange' : 'text-white/90'}`}>
            {values[0]}
          </div>
          {isThreePlayers && (
            <div className={`text-2xl md:text-3xl font-black italic ${highlightIndices.includes(1) ? 'text-nba-orange' : 'text-white/90'}`}>
              {values[1]}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-0.5 px-3 min-w-[100px]">
          <Icon className="w-4 h-4 text-zinc-600" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 whitespace-nowrap">{label}</span>
        </div>

        <div className="flex justify-start pl-6">
          <div className={`text-2xl md:text-3xl font-black italic ${highlightIndices.includes(isThreePlayers ? 2 : 1) ? 'text-nba-orange' : 'text-white/90'}`}>
            {values[isThreePlayers ? 2 : 1]}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black p-6"
      >
        {debugShowResults && (
          <button 
            onClick={toggleDebugResults}
            className="absolute top-6 right-6 z-20 text-white/20 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Theme Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-nba-red/80 font-black uppercase tracking-[0.5em] text-[10px] mb-4"
        >
          {themeName}
        </motion.div>

        {/* Victory Title */}
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-white leading-none mb-2 text-center"
        >
          {getVictoryTitle()}
        </motion.h1>

        {/* Subtitle */}
        {isTie && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl font-black italic uppercase text-zinc-500 tracking-tight mb-8"
          >
            HEADING TO OVERTIME
          </motion.div>
        )}

        {!isTie && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl font-black italic uppercase text-nba-orange tracking-tight mb-8"
          >
            {winnerData?.name} WINS
          </motion.div>
        )}

        {/* Scores */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`flex items-center justify-center gap-6 md:gap-10 mb-8`}
        >
          {players.map((p, idx) => {
            const isWinner = winnerData?.id === p.id;
            return (
              <div key={p.id} className="flex items-center gap-6 md:gap-10">
                <div className="text-center">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">{p.name}</div>
                  <div className={`text-7xl md:text-9xl font-black italic tracking-tighter leading-none transition-colors ${
                    isWinner ? 'text-nba-orange' : 'text-white/40'
                  }`}>
                    {p.score}
                  </div>
                </div>
                {idx < players.length - 1 && (
                  <div className="text-4xl md:text-6xl font-black text-zinc-800 italic mt-6 md:mt-10">/</div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-lg mb-8"
        >
          {(() => {
            const getHighlighter = (statKey: keyof typeof players[0]['stats']) => {
              const maxVal = Math.max(...players.map(p => p.stats[statKey]));
              return maxVal > 0 ? players.map((p, i) => p.stats[statKey] === maxVal ? i : -1).filter(i => i !== -1) : [];
            };

            return (
              <>
                <StatRow 
                  label="Blind Shots" 
                  icon={Target} 
                  values={players.map(p => p.stats.blindShots)} 
                  highlightIndices={getHighlighter('blindShots')}
                />
                <StatRow 
                  label="Max Streak" 
                  icon={Flame} 
                  values={players.map(p => p.stats.maxStreak)}
                  highlightIndices={getHighlighter('maxStreak')}
                />
                <StatRow 
                  label="Total Moves" 
                  icon={MousePointer2} 
                  values={players.map(p => p.stats.totalMoves)}
                />
                <StatRow 
                  label="Time Spent" 
                  icon={Clock} 
                  values={players.map(p => `${p.stats.timeSpent}s`)}
                  highlightIndices={getTimeHighlighter()}
                />
                {jokerEnabled && (
                  <StatRow 
                    label="Traps Hit" 
                    icon={Bomb} 
                    values={players.map(p => p.stats.trapHits)}
                  />
                )}
              </>
            );
          })()}
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center"
        >
          {isTie ? (
            <button 
              onClick={() => initGame(mode, { isTiebreaker: true })}
              className="bg-nba-orange text-white px-12 py-4 rounded-2xl font-black uppercase tracking-[0.15em] hover:bg-white hover:text-black transition-all flex flex-col items-center gap-1 group"
            >
              <span className="flex items-center gap-2">
                Start Overtime <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              </span>
              <span className="text-[10px] font-bold opacity-60 tracking-wider">
                {GAME_CONFIG.tiebreaker.pairs} pairs
              </span>
            </button>
          ) : (
            <button 
              onClick={() => initGame(mode)}
              className="bg-white text-black px-12 py-4 rounded-2xl font-black uppercase tracking-[0.15em] hover:bg-nba-red hover:text-white transition-all flex items-center gap-2 group"
            >
              New Match <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
