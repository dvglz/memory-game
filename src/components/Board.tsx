import { useGameStore } from '../store/useGameStore';
import { Card } from './Card';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { GAME_CONFIG } from '../config/gameConfig';

export const Board = () => {
  const { cards, flipCard, isProcessing, columns: storeColumns, isTiebreaker } = useGameStore();
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (!cards.length) return null;

  const config = isTiebreaker ? GAME_CONFIG.tiebreaker : GAME_CONFIG.main;
  const columns = isMobile ? config.mobileColumns : storeColumns;
  const rows = Math.ceil(cards.length / columns);

  // Mobile cards: 3:4 aspect, Desktop cards: 4:3 aspect
  const cardAspectRatio = isMobile ? (3 / 4) : (4 / 3);
  const gridAspectRatio = (columns / rows) * cardAspectRatio;
  
  // Use dvh for mobile (accounts for Safari's dynamic chrome)
  // Mobile: TopBar ~64px + padding ~16px = ~80px offset
  // Desktop: TopBar ~80px + padding ~40px = ~120px offset
  return (
    <div 
      className="grid gap-1.5 p-1.5 md:gap-2 md:p-4 shadow-2xl"
      style={{ 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        width: isMobile 
          ? `min(98vw, calc((100dvh - 80px) * ${gridAspectRatio}))`
          : `min(calc(95vw - 320px), calc((100vh - 120px) * ${gridAspectRatio}))`,
        maxWidth: '1000px',
        maxHeight: isMobile ? 'calc(100dvh - 80px)' : undefined,
      }}
    >
      {cards.map((card) => (
        <Card 
          key={card.id} 
          card={card} 
          onClick={() => flipCard(card.id)} 
          isProcessing={isProcessing}
        />
      ))}
    </div>
  );
};
