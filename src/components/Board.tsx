import { useGameStore } from '../store/useGameStore';
import { Card } from './Card';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const Board = () => {
  const { cards, flipCard, isProcessing, columns: storeColumns } = useGameStore();
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (!cards.length) return null;

  const columns = storeColumns;
  const rows = Math.ceil(cards.length / columns);

  // Header is ~80px, padding/gaps ~80px. Total offset ~160px
  // We calculate width based on height to ensure it fits
  // Mobile cards: 3:4 aspect, Desktop cards: 4:3 aspect
  const cardAspectRatio = isMobile ? (3 / 4) : (4 / 3);
  const gridAspectRatio = (columns / rows) * cardAspectRatio;
  
  return (
    <div 
      className="grid gap-1.5 p-1.5 md:gap-2 md:p-4 bg-zinc-950/50 backdrop-blur-sm shadow-2xl"
      style={{ 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        // Fit width, but also constrained by height
        // On desktop (md), we subtract space for the scoreboard (~320px)
        width: isMobile 
          ? `min(98vw, calc((100vh - 140px) * ${gridAspectRatio}))`
          : `min(calc(95vw - 320px), calc((100vh - 200px) * ${gridAspectRatio}))`,
        maxWidth: '1000px',
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
