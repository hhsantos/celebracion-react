// Google Drive API Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
export const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
export const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

// Slideshow Configuration
export const DEFAULT_SLIDE_SPEED = 3000;

// Effects Configuration
export const CONFETTI_COUNT = 50;
export const HEARTS_COUNT = 20;
export const SPARKLES_COUNT = 30;

// Colors for effects
export const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

// Authorized domains for Google API
export const AUTHORIZED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'vercel.app',
  'netlify.app'
];