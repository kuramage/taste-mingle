import React, { useState } from 'react';
import SwipeableCard from './SwipeableCard';

const SwipeDeck = () => {
  const [cards, setCards] = useState([
    { image: 'https://via.placeholder.com/300x400?text=1' },
    { image: 'https://via.placeholder.com/300x400?text=2' },
    { image: 'https://via.placeholder.com/300x400?text=3' },
  ]);

  const handleSwipe = (dir) => {
    console.log(`Swiped ${dir}`);
    setCards((prevCards) => prevCards.slice(1)); // Remove the top card
  };

  return (
    <div style={{ position: 'relative', width: '300px', height: '400px', margin: '0 auto' }}>
      {cards.map((card, index) => (
        <SwipeableCard
          key={index}
          image={card.image}
          onSwipe={handleSwipe}
        />
      ))}
    </div>
  );
};

export default SwipeDeck;
