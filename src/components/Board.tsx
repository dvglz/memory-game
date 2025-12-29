import { useGameStore } from '../store/useGameStore';
import { Card } from './Card';

export const Board = () => {
  const { cards, flipCard, isProcessing } = useGameStore();
  const columns = cards.length === 12 ? 4 : 8;

  return (
    <div 
      className="grid gap-2 p-4 bg-zinc-950/50 rounded-xl border border-white/5 backdrop-blur-sm"
      style={{ 
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        aspectRatio: '1/1',
        width: 'min(90vh, 90vw)'
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

