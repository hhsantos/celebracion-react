import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const AICommentOverlay = ({ comment, isVisible, onDismiss, position = 'bottom-left' }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayComment, setDisplayComment] = useState('');

  // Efecto de escritura para el comentario
  useEffect(() => {
    if (isVisible && comment) {
      setDisplayComment('');
      setIsAnimating(true);
      
      let currentIndex = 0;
      const typingSpeed = 50; // ms por carácter
      
      const typewriter = setInterval(() => {
        if (currentIndex < comment.length) {
          setDisplayComment(comment.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typewriter);
          setIsAnimating(false);
        }
      }, typingSpeed);
      
      return () => clearInterval(typewriter);
    }
  }, [comment, isVisible]);

  if (!isVisible || !comment) return null;

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  const animationClasses = isVisible 
    ? 'animate-slide-in opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-4';

  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-sm pointer-events-auto`}>
      <div className={`
        bg-gradient-to-r from-purple-600 to-pink-600 
        text-white rounded-2xl shadow-2xl p-4 
        backdrop-blur-sm border border-white/20
        transform transition-all duration-500 ease-out
        ${animationClasses}
      `}>
        {/* Header del comentario */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 rounded-full p-1.5">
              <MessageCircle className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium opacity-90">
              Comentario IA
            </span>
          </div>
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Contenido del comentario */}
        <div className="text-sm leading-relaxed">
          {displayComment}
          {isAnimating && (
            <span className="inline-block w-0.5 h-4 bg-white ml-1 animate-pulse" />
          )}
        </div>
        
        {/* Indicador de IA */}
        <div className="flex items-center justify-end mt-3 pt-2 border-t border-white/20">
          <div className="flex items-center space-x-1 text-xs opacity-60">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
      
      {/* Puntero/flecha del globo */}
      <div className={`
        absolute w-0 h-0 
        ${position.includes('bottom') ? '-top-2' : '-bottom-2'}
        ${position.includes('left') ? 'left-6' : 'right-6'}
        border-l-8 border-r-8 border-transparent
        ${position.includes('bottom') ? 'border-b-8 border-b-purple-600' : 'border-t-8 border-t-purple-600'}
      `} />
      
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AICommentOverlay;