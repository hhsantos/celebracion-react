import { useState, useEffect } from 'react';
import { generateConfetti, generateHearts, generateSparkles } from '../utils/effectsGenerator.js';

export const useEffects = () => {
  const [confetti, setConfetti] = useState([]);
  const [hearts, setHearts] = useState([]);
  const [sparkles, setSparkles] = useState([]);

  const createConfetti = () => {
    setConfetti(generateConfetti());
  };

  const createHearts = () => {
    setHearts(generateHearts());
  };

  const createSparkles = () => {
    setSparkles(generateSparkles());
  };

  const startAllEffects = () => {
    createConfetti();
    createHearts();
    createSparkles();
  };

  // Animación de efectos especiales
  useEffect(() => {
    const animateEffects = () => {
      setConfetti(prev => prev.map(particle => ({
        ...particle,
        y: particle.y + particle.velocity,
        rotation: particle.rotation + 2
      })).filter(particle => particle.y < window.innerHeight + 50));

      setHearts(prev => prev.map(heart => ({
        ...heart,
        y: heart.y - heart.velocity,
        x: heart.x + Math.sin(heart.y * 0.01) * 0.5
      })).filter(heart => heart.y > -50));

      setSparkles(prev => prev.map(sparkle => ({
        ...sparkle,
        opacity: sparkle.twinkle ? 
          Math.abs(Math.sin(Date.now() * 0.005 + sparkle.id)) : 
          sparkle.opacity
      })));
    };

    const animationInterval = setInterval(animateEffects, 16);
    return () => clearInterval(animationInterval);
  }, []);

  return {
    confetti,
    hearts,
    sparkles,
    createConfetti,
    createHearts,
    createSparkles,
    startAllEffects
  };
};