import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';

interface Particle {
  id: number;
  type: 'pog' | 'fire';
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  rotation: number;
  scale: number;
  duration: number;
  delay: number;
}

export const GameEffects = () => {
  const { players } = useGameStore();
  const [particles, _setParticles] = useState<Particle[]>([]);
  
  // Track previous stats to detect changes
  const prevStats = useRef<{ [key: number]: { blindShots: number; currentStreak: number } }>({});

  useEffect(() => {
    players.forEach((player) => {
      const prev = prevStats.current[player.id];
      
      if (prev) {
        // 1. Blind shot emission (pogchamp.png) - EXPLOSION!
        /* if (player.stats.blindShots > prev.blindShots) {
          emitPogBurst(player.id);
        } */
        
        // 2. Streak emission (fire emoji) - FLAMES RISING!
        /* if (player.stats.currentStreak > prev.currentStreak && player.stats.currentStreak > 1) {
          emitFireBurst(player.id, player.stats.currentStreak);
        } */
      }

      // Update ref for next render
      prevStats.current[player.id] = {
        blindShots: player.stats.blindShots,
        currentStreak: player.stats.currentStreak,
      };
    });
  }, [players]);

  /* 
  // POG BURST - Explosive radial burst pattern
  const emitPogBurst = (playerId: number) => {
    const count = 10;
    const isP1 = playerId === 1;
    const startX = isP1 ? 35 : 65;
    const startY = 6;
    
    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 8 + Math.random() * 12;
      const directionBias = isP1 ? -0.3 : 0.3;
      
      return {
        id: Math.random(),
        type: 'pog' as const,
        x: startX,
        y: startY,
        targetX: startX + Math.cos(angle + directionBias) * distance,
        targetY: startY + Math.sin(angle) * distance * 0.6,
        rotation: Math.random() * 360,
        scale: 0.6 + Math.random() * 0.6,
        duration: 1.0 + Math.random() * 0.4,
        delay: i * 0.03,
      };
    });

    _setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      _setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 2000);
  };

  // FIRE BURST - Rising flames with wave motion
  const emitFireBurst = (playerId: number, streakCount: number) => {
    const count = Math.min(3 + streakCount, 8);
    const isP1 = playerId === 1;
    const startX = isP1 ? 35 : 65;
    const startY = 6;
    
    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
      const spreadX = (i - count / 2) * 3;
      const directionBias = isP1 ? -8 : 8;
      
      return {
        id: Math.random(),
        type: 'fire' as const,
        x: startX,
        y: startY,
        targetX: startX + spreadX + directionBias + (Math.random() - 0.5) * 6,
        targetY: -15 - Math.random() * 10,
        rotation: 0,
        scale: 0.8 + Math.random() * 0.5 + (streakCount * 0.1),
        duration: 1.2 + Math.random() * 0.5,
        delay: i * 0.06,
      };
    });

    _setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      _setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 2000);
  };
  */

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}vw`, 
              y: `${particle.y}vh`, 
              rotate: particle.rotation, 
              scale: 0,
              opacity: 0
            }}
            animate={particle.type === 'pog' ? {
              x: `${particle.targetX}vw`,
              y: `${particle.targetY}vh`, 
              rotate: particle.rotation + (Math.random() > 0.5 ? 360 : -360),
              scale: [0, particle.scale * 1.3, particle.scale, 0],
              opacity: [0, 1, 1, 0],
            } : {
              x: [`${particle.x}vw`, `${particle.x + 2}vw`, `${particle.x - 2}vw`, `${particle.targetX}vw`],
              y: `${particle.targetY}vh`, 
              rotate: [-10, 10, -10, 0],
              scale: [0, particle.scale * 1.2, particle.scale, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ 
              duration: particle.duration,
              delay: particle.delay,
              ease: particle.type === 'pog' ? [0.34, 1.56, 0.64, 1] : 'easeOut',
              scale: { times: [0, 0.2, 0.5, 1] },
              opacity: { times: [0, 0.1, 0.7, 1] },
            }}
            className="absolute"
          >
            {particle.type === 'pog' ? (
              <img 
                src="/assets/misc/pogchamp.png" 
                alt="pog" 
                className="w-10 h-10 md:w-14 md:h-14 object-contain"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255,200,50,0.8)) drop-shadow(0 0 20px rgba(255,100,0,0.5))'
                }}
              />
            ) : (
              <div 
                className="text-3xl md:text-5xl"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(255,100,0,1)) drop-shadow(0 0 30px rgba(255,50,0,0.8))',
                  textShadow: '0 0 20px rgba(255,150,0,1)'
                }}
              >
                🔥
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
