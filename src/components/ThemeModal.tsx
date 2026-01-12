import { motion, AnimatePresence } from 'framer-motion';
import { THEMES, ThemeId } from '../config/gameConfig';
import { useGameStore } from '../store/useGameStore';
import { X, Check } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useNavigate } from 'react-router-dom';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal = ({ isOpen, onClose }: ThemeModalProps) => {
  const { theme } = useGameStore();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const navigate = useNavigate();

  const handleThemeSelect = (themeId: ThemeId) => {
    navigate(`/${themeId}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]"
          />

          {/* Modal / Bottom Sheet */}
          <div className={`fixed inset-0 z-[160] flex ${isMobile ? 'items-end' : 'items-center justify-center p-4'}`}>
            <motion.div
              initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
              animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
              exit={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`bg-zinc-950 border-white/10 overflow-hidden w-full
                ${isMobile 
                  ? 'rounded-t-[32px] border-t' 
                  : 'max-w-lg rounded-3xl border shadow-2xl'
                }`}
            >
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">Select Theme</h2>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Available Modes</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-zinc-500" />
                </button>
              </div>

              <div className="grid gap-3">
                {(Object.entries(THEMES) as [ThemeId, typeof THEMES['nba-teams']][]).map(([id, config]) => {
                  const isSelected = theme === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleThemeSelect(id)}
                      className={`group relative flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300
                        ${isSelected 
                          ? 'bg-nba-red border-nba-orange shadow-[0_0_20px_rgba(255,69,0,0.2)]' 
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                        }`}
                    >
                      <div className="flex flex-col items-start">
                        <span className={`text-xl font-black uppercase italic tracking-tighter ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                          {config.name}
                        </span>
                      </div>
                      
                      {isSelected ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-zinc-800 group-hover:border-zinc-700" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {isMobile && <div className="h-8 w-full" />} {/* Bottom safe area padding */}
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
  );
};
