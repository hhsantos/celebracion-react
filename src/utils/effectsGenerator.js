import { CONFETTI_COUNT, HEARTS_COUNT, SPARKLES_COUNT, CONFETTI_COLORS } from '../config/constants.js';

/**
 * Generates confetti particles
 * @returns {Array} Array of confetti particle objects
 */
export const generateConfetti = () => {
  const confetti = [];
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    confetti.push({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: -10,
      rotation: Math.random() * 360,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 8 + 4,
      velocity: Math.random() * 3 + 2
    });
  }
  return confetti;
};

/**
 * Generates floating hearts
 * @returns {Array} Array of heart objects
 */
export const generateHearts = () => {
  const hearts = [];
  for (let i = 0; i < HEARTS_COUNT; i++) {
    hearts.push({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 10,
      size: Math.random() * 20 + 15,
      velocity: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3
    });
  }
  return hearts;
};

/**
 * Generates sparkles
 * @returns {Array} Array of sparkle objects
 */
export const generateSparkles = () => {
  const sparkles = [];
  for (let i = 0; i < SPARKLES_COUNT; i++) {
    sparkles.push({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 6 + 2,
      opacity: Math.random(),
      twinkle: Math.random() > 0.5
    });
  }
  return sparkles;
};