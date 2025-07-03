import { useState, useEffect } from 'react';

export const useSlideshow = (images, startAllEffects) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cuando se cargan nuevas imágenes, resetear índice e iniciar efectos
  useEffect(() => {
    if (images.length > 0) {
      setCurrentImageIndex(0);
      if (startAllEffects) {
        startAllEffects();
      }
    }
  }, [images, startAllEffects]);

  return {
    currentImageIndex,
    setCurrentImageIndex
  };
};