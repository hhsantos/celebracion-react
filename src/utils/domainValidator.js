import { AUTHORIZED_DOMAINS } from '../config/constants.js';

/**
 * Validates if the current hostname is authorized to use Google Drive API
 * @returns {boolean} True if domain is authorized
 */
export const isAuthorizedDomain = () => {
  const hostname = window.location.hostname;
  
  return AUTHORIZED_DOMAINS.some(domain => 
    hostname === domain || hostname.includes(domain)
  );
};

/**
 * Gets the current hostname for debugging
 * @returns {string} Current hostname
 */
export const getCurrentHostname = () => window.location.hostname;