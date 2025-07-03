import React from 'react';
import { Sparkles, FolderOpen, Heart } from 'lucide-react';

const FolderSelectionScreen = ({ 
  folders, 
  loadFolders, 
  setSelectedFolder, 
  loadImagesFromFolder, 
  isLoading, 
  authError 
}) => {
  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
    loadImagesFromFolder(folder.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              <Sparkles className="inline h-8 w-8 text-yellow-500 mr-2" />
              Selecciona tu carpeta de fotos
            </h1>
            <button
              onClick={loadFolders}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <FolderOpen className="inline h-4 w-4 mr-2" />
              Actualizar
            </button>
          </div>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {authError}
            </div>
          )}
          
          {folders.length === 0 && !isLoading ? (
            <div className="text-center py-8">
              <FolderOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No se encontraron carpetas con imágenes</p>
              <button
                onClick={loadFolders}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Buscar carpetas
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => handleFolderSelect(folder)}
                  className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-xl cursor-pointer hover:from-pink-200 hover:to-purple-200 transition-all duration-200 shadow-lg"
                >
                  <div className="text-center">
                    <div className="bg-pink-500 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{folder.name}</h3>
                    <p className="text-sm text-gray-600">{folder.imageCount} fotos</p>
                    {folder.createdTime && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(folder.createdTime).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderSelectionScreen;