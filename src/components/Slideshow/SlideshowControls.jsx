import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Settings } from 'lucide-react';

const SlideshowControls = ({ 
  isPlaying, 
  currentImageIndex, 
  totalImages, 
  onPrevious, 
  onTogglePlayPause, 
  onNext, 
  onToggleSettings 
}) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-4">
      <button
        onClick={onPrevious}
        className="text-white hover:text-pink-400 transition-colors"
      >
        <SkipBack className="h-6 w-6" />
      </button>
      
      <button
        onClick={onTogglePlayPause}
        className="text-white hover:text-pink-400 transition-colors"
      >
        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
      </button>
      
      <button
        onClick={onNext}
        className="text-white hover:text-pink-400 transition-colors"
      >
        <SkipForward className="h-6 w-6" />
      </button>
      
      <button
        onClick={onToggleSettings}
        className="text-white hover:text-pink-400 transition-colors"
      >
        <Settings className="h-6 w-6" />
      </button>
      
      <span className="text-white text-sm">
        {currentImageIndex + 1} / {totalImages}
      </span>
    </div>
  );
};

export default SlideshowControls;