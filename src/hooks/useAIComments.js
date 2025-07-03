import { useState, useEffect, useRef } from 'react';
import { getSmartComment } from '../services/aiComments.js';

export const useAIComments = (options = {}) => {
  const {
    enabled = true,
    delay = 3000, // 3 segundos después de cambiar imagen
    autoHide = true,
    hideDelay = 8000, // 8 segundos antes de ocultar
    position = 'bottom-left'
  } = options;

  const [currentComment, setCurrentComment] = useState('');
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [usedComments, setUsedComments] = useState([]);
  const [isEnabled, setIsEnabled] = useState(enabled);
  
  const commentTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  // Generar comentario para una imagen específica
  const generateComment = (imageIndex, totalImages) => {
    if (!isEnabled) return;

    // Limpiar timeouts previos
    if (commentTimeoutRef.current) {
      clearTimeout(commentTimeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    // Ocultar comentario actual inmediatamente
    setIsCommentVisible(false);

    // Generar nuevo comentario después del delay
    commentTimeoutRef.current = setTimeout(() => {
      const context = {
        imageIndex,
        totalImages,
        usedComments
      };

      const newComment = getSmartComment(context);
      setCurrentComment(newComment);
      setUsedComments(prev => [...prev, newComment]);
      setIsCommentVisible(true);

      // Auto-ocultar después del hideDelay
      if (autoHide) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsCommentVisible(false);
        }, hideDelay);
      }
    }, delay);
  };

  // Ocultar comentario manualmente
  const hideComment = () => {
    setIsCommentVisible(false);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  // Mostrar comentario manualmente
  const showComment = () => {
    if (currentComment) {
      setIsCommentVisible(true);
      
      if (autoHide) {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
          setIsCommentVisible(false);
        }, hideDelay);
      }
    }
  };

  // Toggle de habilitación
  const toggleEnabled = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    
    if (!newEnabled) {
      hideComment();
    }
    
    return newEnabled;
  };

  // Limpiar comentarios usados (para reiniciar la variedad)
  const clearUsedComments = () => {
    setUsedComments([]);
  };

  // Obtener estadísticas
  const getStats = () => {
    return {
      isEnabled,
      totalUsedComments: usedComments.length,
      currentComment,
      isVisible: isCommentVisible,
      position,
      settings: {
        delay,
        autoHide,
        hideDelay
      }
    };
  };

  // Cleanup en unmount
  useEffect(() => {
    return () => {
      if (commentTimeoutRef.current) {
        clearTimeout(commentTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Estado
    currentComment,
    isCommentVisible,
    isEnabled,
    usedComments,
    
    // Acciones
    generateComment,
    hideComment,
    showComment,
    toggleEnabled,
    clearUsedComments,
    
    // Configuración
    position,
    
    // Utilidades
    getStats
  };
};