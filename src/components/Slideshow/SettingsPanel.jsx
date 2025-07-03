import React from 'react';

const SettingsPanel = ({ 
  slideSpeed, 
  onSlideSpeedChange, 
  onCreateConfetti, 
  onCreateHearts, 
  onCreateSparkles,
  aiCommentsEnabled,
  onToggleAIComments
}) => {
  return (
    <div className="absolute top-8 right-8 bg-black bg-opacity-80 backdrop-blur-sm rounded-lg p-6 text-white min-w-64">
      <h3 className="text-lg font-semibold mb-4">Configuración</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Velocidad del slideshow
        </label>
        <input
          type="range"
          min="1000"
          max="10000"
          value={slideSpeed}
          onChange={(e) => onSlideSpeedChange(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-300">
          {slideSpeed / 1000}s por imagen
        </span>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center justify-between text-sm font-medium mb-2">
          <span>Comentarios de IA</span>
          <button
            onClick={onToggleAIComments}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${aiCommentsEnabled ? 'bg-blue-600' : 'bg-gray-600'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${aiCommentsEnabled ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </label>
        <p className="text-xs text-gray-300">
          {aiCommentsEnabled ? 'Los comentarios aparecerán automáticamente' : 'Los comentarios están desactivados'}
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={onCreateConfetti}
          className="w-full bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          🎉 Más Confetti
        </button>
        <button
          onClick={onCreateHearts}
          className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          💖 Más Corazones
        </button>
        <button
          onClick={onCreateSparkles}
          className="w-full bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          ✨ Más Brillos
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;