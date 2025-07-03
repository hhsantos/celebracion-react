import React, { useState, useEffect, useRef } from 'react';
import EffectsContainer from '../Effects/EffectsContainer.jsx';
import SlideshowControls from './SlideshowControls.jsx';
import SettingsPanel from './SettingsPanel.jsx';
import ProgressBar from './ProgressBar.jsx';
import { DEFAULT_SLIDE_SPEED } from '../../config/constants.js';

const SlideshowScreen = ({ 
  images, 
  confetti, 
  hearts, 
  sparkles, 
  createConfetti, 
  createHearts, 
  createSparkles 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideSpeed, setSlideSpeed] = useState(DEFAULT_SLIDE_SPEED);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  // Control del slideshow
  useEffect(() => {
    if (isPlaying && images.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, slideSpeed);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, slideSpeed, images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleImageError = (e) => {
    console.error('Error loading image:', e.target.src);
    // Ocultar imagen que falló en cargar
    e.target.style.display = 'none';
  };

  const handleImageLoad = (e) => {
    console.log('Image loaded successfully:', e.target.src);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Efectos especiales */}
      <EffectsContainer 
        confetti={confetti} 
        hearts={hearts} 
        sparkles={sparkles} 
      />

      {/* Imagen principal */}
      <div className="absolute inset-0 flex items-center justify-center">
        {images.length > 0 && images[currentImageIndex] && (
          <img
            src={images[currentImageIndex]}
            alt={`Slide ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-fade-in"
            style={{
              filter: 'brightness(1.1) saturate(1.1)',
              boxShadow: '0 0 50px rgba(255, 105, 180, 0.3)'
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        {images.length === 0 && (
          <div className="text-white text-center">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-2xl font-bold">¡Cargando imágenes!</p>
          </div>
        )}
      </div>

      {/* Controles */}
      <SlideshowControls
        isPlaying={isPlaying}
        currentImageIndex={currentImageIndex}
        totalImages={images.length}
        onPrevious={prevImage}
        onTogglePlayPause={togglePlayPause}
        onNext={nextImage}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      {/* Panel de configuración */}
      {showSettings && (
        <SettingsPanel
          slideSpeed={slideSpeed}
          onSlideSpeedChange={setSlideSpeed}
          onCreateConfetti={createConfetti}
          onCreateHearts={createHearts}
          onCreateSparkles={createSparkles}
        />
      )}

      {/* Indicadores de progreso */}
      <ProgressBar 
        currentIndex={currentImageIndex} 
        totalImages={images.length} 
      />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SlideshowScreen;