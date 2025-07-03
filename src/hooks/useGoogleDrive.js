import { useState } from 'react';

export const useGoogleDrive = ({ setDebugInfo, setAuthError }) => {
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar carpetas desde Google Drive
  const loadFolders = async () => {
    try {
      setIsLoading(true);
      setDebugInfo('Iniciando carga de carpetas...');
      
      // Verificar que tenemos acceso a Drive API
      if (!window.gapi?.client?.drive) {
        throw new Error('Google Drive API no está disponible');
      }
      
      setDebugInfo('Drive API disponible, haciendo solicitud...');
      
      const response = await window.gapi.client.drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
        pageSize: 20,
        fields: 'files(id, name, createdTime, parents)'
      });

      setDebugInfo('Respuesta de carpetas recibida');

      const foldersData = response.result.files || [];
      setDebugInfo(`Encontradas ${foldersData.length} carpetas`);
      
      if (foldersData.length === 0) {
        setDebugInfo('No se encontraron carpetas en Google Drive');
        setFolders([]);
        return;
      }
      
      // Obtener el conteo de imágenes para cada carpeta
      setDebugInfo('Contando imágenes en carpetas...');
      const foldersWithCount = await Promise.all(
        foldersData.map(async (folder) => {
          try {
            const fullResponse = await window.gapi.client.drive.files.list({
              q: `'${folder.id}' in parents and (mimeType contains 'image/') and trashed=false`,
              pageSize: 1000
            });

            const imageCount = fullResponse.result.files?.length || 0;

            return {
              id: folder.id,
              name: folder.name,
              imageCount: imageCount,
              createdTime: folder.createdTime
            };
          } catch (folderError) {
            console.error(`Error checking folder ${folder.name}:`, folderError);
            return {
              id: folder.id,
              name: folder.name,
              imageCount: 0,
              createdTime: folder.createdTime
            };
          }
        })
      );

      // Filtrar solo carpetas con imágenes
      const foldersWithImages = foldersWithCount.filter(folder => folder.imageCount > 0);
      
      setFolders(foldersWithImages);
      setDebugInfo(`Cargadas ${foldersWithImages.length} carpetas con imágenes`);
      
    } catch (error) {
      console.error('Error loading folders:', error);
      const errorMessage = error?.result?.error?.message || error?.message || 'Error desconocido';
      setAuthError('Error al cargar carpetas: ' + errorMessage);
      setDebugInfo('Error detallado: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar imágenes desde una carpeta específica
  const loadImagesFromFolder = async (folderId) => {
    try {
      setIsLoading(true);
      
      const response = await window.gapi.client.drive.files.list({
        q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed=false`,
        pageSize: 1000,
        fields: 'files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink)'
      });

      const imageFiles = response.result.files || [];
      
      // Generar URLs de visualización para las imágenes
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          try {
            // Priorizar thumbnails de alta calidad (más confiables)
            if (file.thumbnailLink) {
              // Thumbnail de muy alta resolución (1600px)
              const url = file.thumbnailLink.replace('=s220', '=s1600');
              return url;
            } else if (file.webContentLink) {
              // URL directa al archivo como backup
              const url = file.webContentLink.replace('&export=download', '');
              return url;
            } else {
              // Último recurso: API con token
              const token = window.gapi.client.getToken();
              if (token?.access_token) {
                const url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&access_token=${token.access_token}`;
                return url;
              } else {
                return null;
              }
            }
          } catch (error) {
            console.error('Error getting image URL:', error);
            return file.thumbnailLink; // Fallback al thumbnail original
          }
        })
      );

      setImages(imageUrls.filter(Boolean));
      
    } catch (error) {
      console.error('Error loading images:', error);
      setAuthError('Error al cargar imágenes desde Google Drive');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    folders,
    images,
    selectedFolder,
    isLoading,
    setSelectedFolder,
    loadFolders,
    loadImagesFromFolder
  };
};