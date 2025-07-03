import React from 'react';
import { Sparkles } from 'lucide-react';

const SparklesEffect = ({ sparkles }) => {
  return (
    <>
      {sparkles.map((sparkle) => (
        <Sparkles
          key={sparkle.id}
          className="absolute text-yellow-300"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            fontSize: sparkle.size,
            opacity: sparkle.opacity,
          }}
        />
      ))}
    </>
  );
};

export default SparklesEffect;