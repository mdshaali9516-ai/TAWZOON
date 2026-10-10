import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Progressive Web App Service Worker registration
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  // If in development or preview mode, unregister any service workers to avoid stale caching & React version mismatch
  if (import.meta.env.DEV || window.location.hostname.includes('ais-dev')) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        for (const name of cacheNames) {
          caches.delete(name);
        }
      });
    }
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('TAWZOON NEXUS ServiceWorker registered successfully with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('ServiceWorker registration error:', error);
        });
    });
  }
}

