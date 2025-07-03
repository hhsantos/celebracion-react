import { useState } from 'react';
import { GOOGLE_CLIENT_ID, SCOPES } from '../config/constants.js';

export const useGoogleAuth = ({ gapiInitialized, setDebugInfo, setAuthError }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
            
            // Verificar que Drive API está disponible antes de continuar
            if (!window.gapi.client.drive) {
              console.log('Drive API not available, loading...');
              await window.gapi.client.load('drive', 'v3');
            }
            
            setDebugInfo('Autenticación exitosa');
            setIsAuthenticated(true);
            setIsLoading(false);
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

  return {
    isAuthenticated,
    isLoading,
    handleGoogleAuth
  };
};