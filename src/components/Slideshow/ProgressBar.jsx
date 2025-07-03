import React from 'react';

const ProgressBar = ({ currentIndex, totalImages }) => {
  const progress = totalImages > 0 ? ((currentIndex + 1) / totalImages) * 100 : 0;

  return (
    <div className="absolute top-8 left-8 right-8">
      <div className="bg-black bg-opacity-30 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;