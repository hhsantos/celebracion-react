import { useState, useEffect } from 'react';
import { GOOGLE_CLIENT_ID, GOOGLE_API_KEY, SCOPES } from '../config/constants.js';
import { isAuthorizedDomain, getCurrentHostname } from '../utils/domainValidator.js';

// Variables globales para Google API
let _gapi;
let _google;

export const useGoogleAPI = () => {
  const [gapiInitialized, setGapiInitialized] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const initializeGapi = async () => {
      try {
        setDebugInfo('Iniciando carga de Google API...');
        
        // Verificar si estamos en un entorno que soporta Google API
        if (typeof window === 'undefined') {
          setAuthError('Google API no está disponible en este entorno');
          return;
        }

        // Verificar si estamos en un dominio autorizado
        if (!isAuthorizedDomain()) {
          setAuthError('Esta aplicación requiere ejecutarse en un dominio autorizado para acceder a Google Drive');
          setDebugInfo('Dominio actual: ' + getCurrentHostname() + ' - Dominio no autorizado');
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
      }
    };

    const loadGapi = async () => {
      try {
        setDebugInfo('Cargando cliente GAPI...');
        
        if (!window.gapi) {
          throw new Error('window.gapi no está disponible');
        }

        setDebugInfo('Intentando cargar módulos client...');
        
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

        setDebugInfo('Inicializando cliente GAPI (solo Drive API)...');
        
        const initConfig = {
          apiKey: GOOGLE_API_KEY
        };

        try {
          await window.gapi.client.init(initConfig);
          setDebugInfo('gapi.client.init completado exitosamente');
          
          // Cargar Drive API manualmente
          await window.gapi.client.load('drive', 'v3');
          setDebugInfo('Drive API cargado exitosamente');
          
          // Verificar que Drive API está disponible
          if (window.gapi.client.drive) {
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
        
        // Inicializar Google Identity Services para autenticación
        if (window.google?.accounts?.oauth2) {
          setDebugInfo('Google Identity Services disponible');
        }
        
        setGapiInitialized(true);
      } catch (error) {
        console.error('Error initializing GAPI client:', error);
        const errorMessage = error?.message || 'Error desconocido en loadGapi';
        setAuthError('Error al inicializar Google API: ' + errorMessage);
        setDebugInfo('Error detallado en cliente GAPI: ' + errorMessage);
      }
    };

    initializeGapi();
  }, []);

  return {
    gapiInitialized,
    authError,
    debugInfo,
    setAuthError,
    setDebugInfo
  };
};