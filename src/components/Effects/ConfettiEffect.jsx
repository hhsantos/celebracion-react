import React from 'react';

const ConfettiEffect = ({ confetti }) => {
  return (
    <>
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 opacity-80"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </>
  );
};

export default ConfettiEffect;