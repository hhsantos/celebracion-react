import React from 'react';
import { useGoogleAPI } from './hooks/useGoogleAPI.js';
import { useGoogleAuth } from './hooks/useGoogleAuth.js';
import { useGoogleDrive } from './hooks/useGoogleDrive.js';
import { useEffects } from './hooks/useEffects.js';

import AuthScreen from './components/Auth/AuthScreen.jsx';
import FolderSelectionScreen from './components/FolderSelection/FolderSelectionScreen.jsx';
import LoadingScreen from './components/Slideshow/LoadingScreen.jsx';
import SlideshowScreen from './components/Slideshow/SlideshowScreen.jsx';

import './App.css';

const BirthdaySlideshow = () => {
  // Google API initialization
  const { gapiInitialized, authError, debugInfo, setAuthError, setDebugInfo } = useGoogleAPI();
  
  // Google authentication
  const { isAuthenticated, isLoading, handleGoogleAuth } = useGoogleAuth({
    gapiInitialized,
    setDebugInfo,
    setAuthError
  });
  
  // Google Drive operations
  const {
    folders,
    images,
    selectedFolder,
    isLoading: isDriveLoading,
    setSelectedFolder,
    loadFolders,
    loadImagesFromFolder
  } = useGoogleDrive({ setDebugInfo, setAuthError });
  
  // Special effects
  const {
    confetti,
    hearts,
    sparkles,
    createConfetti,
    createHearts,
    createSparkles,
    startAllEffects
  } = useEffects();
  

  // Auto-load folders when authenticated
  React.useEffect(() => {
    if (isAuthenticated && folders.length === 0) {
      loadFolders();
    }
  }, [isAuthenticated, folders.length, loadFolders]);

  // Handle folder selection with effects
  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
    loadImagesFromFolder(folder.id);
  };

  // Render appropriate screen based on state
  if (!isAuthenticated) {
    return (
      <AuthScreen
        handleGoogleAuth={handleGoogleAuth}
        isLoading={isLoading}
        gapiInitialized={gapiInitialized}
        authError={authError}
        debugInfo={debugInfo}
      />
    );
  }

  if (!selectedFolder) {
    return (
      <FolderSelectionScreen
        folders={folders}
        loadFolders={loadFolders}
        setSelectedFolder={handleFolderSelect}
        loadImagesFromFolder={loadImagesFromFolder}
        isLoading={isDriveLoading}
        authError={authError}
      />
    );
  }

  if (isDriveLoading) {
    return <LoadingScreen />;
  }

  return (
    <SlideshowScreen
      images={images}
      confetti={confetti}
      hearts={hearts}
      sparkles={sparkles}
      createConfetti={createConfetti}
      createHearts={createHearts}
      createSparkles={createSparkles}
    />
  );
};

export default BirthdaySlideshow;