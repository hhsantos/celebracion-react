import React from 'react';
import { PartyPopper } from 'lucide-react';
import { GOOGLE_CLIENT_ID, GOOGLE_API_KEY } from '../../config/constants.js';

const AuthScreen = ({ 
  handleGoogleAuth, 
  isLoading, 
  gapiInitialized, 
  authError, 
  debugInfo 
}) => {
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
            <p><strong>Client ID:</strong> {GOOGLE_CLIENT_ID?.substring(0, 20)}...</p>
            <p><strong>API Key:</strong> {GOOGLE_API_KEY?.substring(0, 20)}...</p>
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
};

export default AuthScreen;