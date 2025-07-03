import React from 'react';
import { Heart } from 'lucide-react';

const HeartsEffect = ({ hearts }) => {
  return (
    <>
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className="absolute text-pink-400"
          style={{
            left: heart.x,
            top: heart.y,
            fontSize: heart.size,
            opacity: heart.opacity,
          }}
        />
      ))}
    </>
  );
};

export default HeartsEffect;