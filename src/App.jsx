import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Settings, Heart, PartyPopper, Sparkles, FolderOpen } from 'lucide-react';
import './App.css';

// Configuración de Google Drive API
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

// Variables globales para Google API
let _gapi;
let _google;

const BirthdaySlideshow = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideSpeed, setSlideSpeed] = useState(3000);
  const [showSettings, setShowSettings] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [hearts, setHearts] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [gapiInitialized, setGapiInitialized] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
    
  const intervalRef = useRef(null);


  // Inicializar Google API
  useEffect(() => {
    const initializeGapi = async () => {
      try {
        setDebugInfo('Iniciando carga de Google API...');
        
        // Eliminar test de conectividad que causa error 404
        
        // Verificar si estamos en un entorno que soporta Google API
        if (typeof window === 'undefined') {
          setAuthError('Google API no está disponible en este entorno');
          return;
        }

        // Verificar si estamos en localhost o dominio autorizado
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || 
                           hostname === '127.0.0.1' || 
                           hostname.includes('localhost');
        
        console.log('Current hostname:', hostname);
        console.log('Is localhost:', isLocalhost);
        
        if (!isLocalhost) {
          setAuthError('Esta aplicación requiere ejecutarse en localhost para acceder a Google Drive');
          setDebugInfo('Dominio actual: ' + hostname + ' - Se requiere localhost');
          showAlternativeOptions();
          return;
        }
        
        // Cargar Google API y Google Identity Services
        if (!window.gapi) {
          setDebugInfo('Cargando scripts de Google API y GIS...');
          
          // Cargar ambos scripts: gapi y gis
          const gapiScript = document.createElement('script');
          gapiScript.src = 'https://apis.google.com/js/api.js';
          gapiScript.async = true;
          gapiScript.defer = true;
          
          const gisScript = document.createElement('script');
          gisScript.src = 'https://accounts.google.com/gsi/client';
          gisScript.async = true;
          gisScript.defer = true;
          
          // Promesas para manejar la carga de ambos scripts
          const gapiPromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('GAPI script load timeout'));
            }, 15000);
            
            gapiScript.onload = () => {
              clearTimeout(timeout);
              resolve();
            };
            gapiScript.onerror = (error) => {
              clearTimeout(timeout);
              console.error('GAPI script load error:', error);
              reject(new Error('Failed to load Google API script'));
            };
            gapiScript.onabort = () => {
              clearTimeout(timeout);
              reject(new Error('GAPI script load aborted'));
            };
          });
          
          const gisPromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('GIS script load timeout'));
            }, 15000);
            
            gisScript.onload = () => {
              clearTimeout(timeout);
              resolve();
            };
            gisScript.onerror = (error) => {
              clearTimeout(timeout);
              console.error('GIS script load error:', error);
              reject(new Error('Failed to load Google Identity Services script'));
            };
            gisScript.onabort = () => {
              clearTimeout(timeout);
              reject(new Error('GIS script load aborted'));
            };
          });
          
          document.head.appendChild(gapiScript);
          document.head.appendChild(gisScript);
          
          try {
            await Promise.all([gapiPromise, gisPromise]);
            setDebugInfo('Scripts cargados exitosamente, verificando APIs...');
            
            // Esperar un poco para que las APIs se inicialicen
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (!window.gapi) {
              throw new Error('window.gapi no está disponible después de cargar el script');
            }
            
            if (!window.google) {
              throw new Error('window.google (GIS) no está disponible después de cargar el script');
            }
            
            setDebugInfo('APIs confirmadas (gapi + GIS), inicializando...');
            await loadGapi();
          } catch (error) {
            console.error('Error loading Google API scripts:', error);
            setAuthError('No se pudo cargar Google API: ' + (error.message || 'Unknown error'));
            setDebugInfo('Error al cargar scripts: ' + (error.message || 'Verificar conexión y permisos'));
            
            // Ofrecer alternativa
            showAlternativeOptions();
          }
        } else {
          setDebugInfo('Google API ya está cargado, inicializando...');
          await loadGapi();
        }
      } catch (error) {
        console.error('Error initializing GAPI:', error);
        const errorMessage = error?.message || 'Error desconocido';
        setAuthError('Error al inicializar Google API: ' + errorMessage);
        setDebugInfo('Error en inicialización: ' + errorMessage);
        showAlternativeOptions();
      }
    };

    const loadGapi = async () => {
      try {
        setDebugInfo('Cargando cliente GAPI...');
        
        if (!window.gapi) {
          throw new Error('window.gapi no está disponible');
        }

        console.log('window.gapi available:', !!window.gapi);
        console.log('gapi.load available:', !!window.gapi.load);

        setDebugInfo('Intentando cargar módulos client:auth2...');
        
        await new Promise((resolve, reject) => {
          try {
            window.gapi.load('client', {
              callback: () => {
                console.log('GAPI client loaded successfully');
                setDebugInfo('Módulo client cargado exitosamente');
                resolve();
              },
              onerror: (error) => {
                console.error('Error loading gapi client:', error);
                setDebugInfo('Error al cargar módulo client: ' + JSON.stringify(error));
                reject(new Error('Failed to load gapi client module: ' + JSON.stringify(error)));
              },
              timeout: 15000,
              ontimeout: () => {
                console.error('Timeout loading gapi client');
                setDebugInfo('Timeout al cargar módulo client');
                reject(new Error('Timeout loading gapi client'));
              }
            });
          } catch (loadError) {
            console.error('Exception in gapi.load:', loadError);
            setDebugInfo('Excepción en gapi.load: ' + loadError.message);
            reject(loadError);
          }
        });

        setDebugInfo('Verificando disponibilidad de gapi.client...');
        
        if (!window.gapi.client) {
          throw new Error('gapi.client no está disponible después de cargar módulos');
        }

        console.log('gapi.client available:', !!window.gapi.client);
        console.log('google.accounts available:', !!window.google?.accounts);

        setDebugInfo('Inicializando cliente GAPI (solo Drive API)...');
        
        const initConfig = {
          apiKey: GOOGLE_API_KEY
          // Cargaremos Drive API por separado para evitar problemas con discovery docs
        };
        
        console.log('Init config:', {
          ...initConfig,
          apiKey: initConfig.apiKey.substring(0, 10) + '...'
        });

        console.log('About to call gapi.client.init...');
        setDebugInfo('Llamando a gapi.client.init...');
        
        try {
          await window.gapi.client.init(initConfig);
          console.log('gapi.client.init completed successfully');
          setDebugInfo('gapi.client.init completado exitosamente');
          
          // Cargar Drive API manualmente (siempre)
          console.log('Loading Drive API manually...');
          setDebugInfo('Cargando Drive API manualmente...');
          
          await window.gapi.client.load('drive', 'v3');
          console.log('Drive API loaded successfully');
          setDebugInfo('Drive API cargado exitosamente');
          
          // Verificar que Drive API está disponible
          if (window.gapi.client.drive) {
            console.log('Drive API confirmed available');
            setDebugInfo('Drive API confirmado disponible');
          } else {
            throw new Error('Drive API no se pudo cargar');
          }
          
        } catch (initError) {
          console.error('Error in gapi.client.init:', initError);
          setDebugInfo('Error en gapi.client.init: ' + initError.message);
          throw initError;
        }

        setDebugInfo('Cliente GAPI inicializado correctamente');
        console.log('GAPI client initialized successfully');
        
        // Inicializar Google Identity Services para autenticación
        if (window.google?.accounts?.oauth2) {
          setDebugInfo('Configurando Google Identity Services...');
          
          // Configurar el cliente OAuth
          window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: SCOPES,
            callback: (response) => {
              console.log('OAuth response:', response);
              if (response.access_token) {
                setIsAuthenticated(true);
                setGapiInitialized(true);
                loadFolders();
              }
            }
          });
          
          setDebugInfo('Google Identity Services configurado');
        }
        
        setGapiInitialized(true);
      } catch (error) {
        console.error('Error initializing GAPI client:', error);
        console.error('Error details:', {
          message: error?.message,
          stack: error?.stack,
          name: error?.name
        });
        const errorMessage = error?.message || 'Error desconocido en loadGapi';
        setAuthError('Error al inicializar Google API: ' + errorMessage);
        setDebugInfo('Error detallado en cliente GAPI: ' + errorMessage + ' | Stack: ' + (error?.stack || 'No stack'));
        showAlternativeOptions();
      }
    };

    const showAlternativeOptions = () => {
      setDebugInfo(`
        ALTERNATIVAS DISPONIBLES:
        1. Usar un navegador local (Chrome, Firefox, Safari)
        2. Descargar el código y ejecutarlo en localhost
        3. Usar la versión demo con imágenes de ejemplo
        4. Desactivar bloqueadores de contenido
      `);
    };


    initializeGapi();
  }, []);

  // Autenticación con Google usando GIS
  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      setDebugInfo('Iniciando proceso de autenticación...');
      
      if (!gapiInitialized) {
        throw new Error('Google API no está inicializada');
      }

      if (!window.google?.accounts?.oauth2) {
        throw new Error('Google Identity Services no está disponible');
      }

      setDebugInfo('Solicitando autorización con GIS...');
      
      // Crear cliente de token OAuth
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: async (response) => {
          console.log('Token response:', response);
          if (response.access_token) {
            setDebugInfo('Token obtenido, configurando acceso...');
            
            // Configurar el token de acceso para gapi
            window.gapi.client.setToken({
              access_token: response.access_token
            });
            
            // Verificar que el token se configuró correctamente
            const currentToken = window.gapi.client.getToken();
            console.log('Token set successfully:', !!currentToken?.access_token);
            
            // Verificar que Drive API está disponible antes de cargar carpetas
            if (!window.gapi.client.drive) {
              console.log('Drive API not available, loading...');
              await window.gapi.client.load('drive', 'v3');
            }
            
            setDebugInfo('Autenticación exitosa, cargando carpetas...');
            setIsAuthenticated(true);
            setIsLoading(false);
            await loadFolders();
          } else {
            throw new Error('No se obtuvo token de acceso');
          }
        },
        error_callback: (error) => {
          console.error('OAuth error:', error);
          setAuthError('Error de autenticación: ' + JSON.stringify(error));
          setIsLoading(false);
        }
      });
      
      // Solicitar token
      tokenClient.requestAccessToken({
        prompt: 'consent'
      });
      
    } catch (error) {
      console.error('Error en autenticación:', error);
      setAuthError('Error al autenticar: ' + error.message);
      setDebugInfo('Error en autenticación: ' + error.message);
      setIsLoading(false);
    }
  };

  // Cargar carpetas desde Google Drive
  const loadFolders = async () => {
    try {
      setIsLoading(true);
      setDebugInfo('Iniciando carga de carpetas...');
      console.log('Starting to load folders from Google Drive');
      
      // Verificar que tenemos acceso a Drive API
      if (!window.gapi?.client?.drive) {
        throw new Error('Google Drive API no está disponible');
      }
      
      console.log('Drive API available, making request...');
      setDebugInfo('Drive API disponible, haciendo solicitud...');
      
      const response = await window.gapi.client.drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
        pageSize: 20,
        fields: 'files(id, name, createdTime, parents)'
      });

      console.log('Folders response:', response);
      setDebugInfo('Respuesta de carpetas recibida');

      const foldersData = response.result.files || [];
      console.log('Found folders:', foldersData.length);
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
            console.log(`Checking images in folder: ${folder.name}`);
            
            const fullResponse = await window.gapi.client.drive.files.list({
              q: `'${folder.id}' in parents and (mimeType contains 'image/') and trashed=false`,
              pageSize: 1000
            });

            const imageCount = fullResponse.result.files?.length || 0;
            console.log(`Folder ${folder.name}: ${imageCount} images`);

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

      console.log('Folders with count:', foldersWithCount);

      // Filtrar solo carpetas con imágenes
      const foldersWithImages = foldersWithCount.filter(folder => folder.imageCount > 0);
      console.log('Folders with images:', foldersWithImages);
      
      setFolders(foldersWithImages);
      setDebugInfo(`Cargadas ${foldersWithImages.length} carpetas con imágenes`);
      
    } catch (error) {
      console.error('Error loading folders:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        result: error?.result
      });
      
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
      console.log('Image files found:', imageFiles.length);
      
      // Generar URLs de visualización para las imágenes
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          try {
            console.log('Processing file:', file.name, {
              webContentLink: !!file.webContentLink,
              thumbnailLink: !!file.thumbnailLink,
              webViewLink: !!file.webViewLink
            });
            
            // Priorizar thumbnails de alta calidad (más confiables)
            if (file.thumbnailLink) {
              // Thumbnail de muy alta resolución (1600px)
              const url = file.thumbnailLink.replace('=s220', '=s1600');
              console.log('Using high-res thumbnail:', url);
              return url;
            } else if (file.webContentLink) {
              // URL directa al archivo como backup
              const url = file.webContentLink.replace('&export=download', '');
              console.log('Using webContentLink:', url);
              return url;
            } else {
              // Último recurso: API con token
              const token = window.gapi.client.getToken();
              if (token?.access_token) {
                const url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&access_token=${token.access_token}`;
                console.log('Using API media URL with token:', url);
                return url;
              } else {
                console.log('No options available for:', file.name);
                return null;
              }
            }
          } catch (error) {
            console.error('Error getting image URL:', error);
            return file.thumbnailLink; // Fallback al thumbnail original
          }
        })
      );

      console.log('Generated URLs:', imageUrls);

      setImages(imageUrls.filter(Boolean));
      setCurrentImageIndex(0);
      
      // Iniciar efectos especiales
      createConfetti();
      createHearts();
      createSparkles();
      
    } catch (error) {
      console.error('Error loading images:', error);
      setAuthError('Error al cargar imágenes desde Google Drive');
    } finally {
      setIsLoading(false);
    }
  };
  const createConfetti = () => {
    const newConfetti = [];
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: -10,
        rotation: Math.random() * 360,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][Math.floor(Math.random() * 5)],
        size: Math.random() * 8 + 4,
        velocity: Math.random() * 3 + 2
      });
    }
    setConfetti(newConfetti);
  };

  // Efectos especiales - Corazones flotantes
  const createHearts = () => {
    const newHearts = [];
    for (let i = 0; i < 20; i++) {
      newHearts.push({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 10,
        size: Math.random() * 20 + 15,
        velocity: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3
      });
    }
    setHearts(newHearts);
  };

  // Efectos especiales - Sparkles
  const createSparkles = () => {
    const newSparkles = [];
    for (let i = 0; i < 30; i++) {
      newSparkles.push({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 6 + 2,
        opacity: Math.random(),
        twinkle: Math.random() > 0.5
      });
    }
    setSparkles(newSparkles);
  };

  // Efectos especiales - Confetti

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

  // Animación de efectos especiales
  useEffect(() => {
    const animateEffects = () => {
      setConfetti(prev => prev.map(particle => ({
        ...particle,
        y: particle.y + particle.velocity,
        rotation: particle.rotation + 2
      })).filter(particle => particle.y < window.innerHeight + 50));

      setHearts(prev => prev.map(heart => ({
        ...heart,
        y: heart.y - heart.velocity,
        x: heart.x + Math.sin(heart.y * 0.01) * 0.5
      })).filter(heart => heart.y > -50));

      setSparkles(prev => prev.map(sparkle => ({
        ...sparkle,
        opacity: sparkle.twinkle ? 
          Math.abs(Math.sin(Date.now() * 0.005 + sparkle.id)) : 
          sparkle.opacity
      })));
    };

    const animationInterval = setInterval(animateEffects, 16);
    return () => clearInterval(animationInterval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Pantalla de autenticación
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <PartyPopper className="mx-auto h-16 w-16 text-pink-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Celebremos!</h1>
            <p className="text-gray-600">Crea una presentación mágica con tus fotos de cumpleaños</p>
          </div>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              <strong>Error:</strong> {authError}
            </div>
          )}
          
          {debugInfo && import.meta.env.DEV && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-sm">
              <strong>Debug:</strong> {debugInfo}
            </div>
          )}
          
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading || !gapiInitialized}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 mb-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Conectando...
              </div>
            ) : !gapiInitialized ? (
              'Inicializando Google API...'
            ) : (
              'Conectar con Google Drive'
            )}
          </button>
          
          
          <p className="text-xs text-gray-500 mt-4">
            Se requiere acceso de solo lectura a Google Drive
          </p>
          
          {/* Información de debug adicional - Solo en desarrollo */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
              <p><strong>Client ID:</strong> {GOOGLE_CLIENT_ID.substring(0, 20)}...</p>
              <p><strong>API Key:</strong> {GOOGLE_API_KEY.substring(0, 20)}...</p>
              <p><strong>GAPI Status:</strong> {gapiInitialized ? '✅ Inicializado' : '❌ No inicializado'}</p>
              <p><strong>Current URL:</strong> {window.location.origin}</p>
            </div>
          )}
          
          {/* Instrucciones para uso local */}
          {authError && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-sm">
              <h4 className="font-semibold mb-2">💡 Para usar Google Drive real:</h4>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Copia este código a tu computadora</li>
                <li>Ejecuta en localhost (puerto 3000 o 8080)</li>
                <li>Configura el dominio en Google Cloud Console</li>
                <li>Añade: <code>http://localhost:3000</code> a "Authorized JavaScript origins"</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pantalla de selección de carpeta
  if (!selectedFolder) {
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
                    onClick={() => {
                      setSelectedFolder(folder);
                      loadImagesFromFolder(folder.id);
                    }}
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
  }

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Preparando la magia...</p>
        </div>
      </div>
    );
  }

  // Pantalla principal del slideshow
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Efectos especiales */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Confetti */}
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 opacity-80"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              transform: `rotate(${particle.rotation}deg)`,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
        
        {/* Corazones */}
        {hearts.map((heart) => (
          <Heart
            key={heart.id}
            className="absolute text-pink-400"
            style={{
              left: heart.x,
              top: heart.y,
              fontSize: heart.size,
              opacity: heart.opacity,
            }}
          />
        ))}
        
        {/* Sparkles */}
        {sparkles.map((sparkle) => (
          <Sparkles
            key={sparkle.id}
            className="absolute text-yellow-300"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              fontSize: sparkle.size,
              opacity: sparkle.opacity,
            }}
          />
        ))}
      </div>

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
            onError={(e) => {
              console.error('Error loading image:', e.target.src);
              // Ocultar imagen que falló en cargar
              e.target.style.display = 'none';
            }}
            onLoad={(e) => {
              console.log('Image loaded successfully:', e.target.src);
            }}
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-4">
        <button
          onClick={prevImage}
          className="text-white hover:text-pink-400 transition-colors"
        >
          <SkipBack className="h-6 w-6" />
        </button>
        
        <button
          onClick={togglePlayPause}
          className="text-white hover:text-pink-400 transition-colors"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        
        <button
          onClick={nextImage}
          className="text-white hover:text-pink-400 transition-colors"
        >
          <SkipForward className="h-6 w-6" />
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-white hover:text-pink-400 transition-colors"
        >
          <Settings className="h-6 w-6" />
        </button>
        
        <span className="text-white text-sm">
          {currentImageIndex + 1} / {images.length}
        </span>
      </div>

      {/* Panel de configuración */}
      {showSettings && (
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
              onChange={(e) => setSlideSpeed(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-300">
              {slideSpeed / 1000}s por imagen
            </span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={createConfetti}
              className="w-full bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              🎉 Más Confetti
            </button>
            <button
              onClick={createHearts}
              className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              💖 Más Corazones
            </button>
            <button
              onClick={createSparkles}
              className="w-full bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              ✨ Más Brillos
            </button>
          </div>
        </div>
      )}

      {/* Indicadores de progreso */}
      <div className="absolute top-8 left-8 right-8">
        <div className="bg-black bg-opacity-30 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentImageIndex + 1) / images.length) * 100}%` }}
          />
        </div>
      </div>

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

export default BirthdaySlideshow;