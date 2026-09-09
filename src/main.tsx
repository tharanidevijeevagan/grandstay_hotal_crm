import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite HMR WebSocket connection errors in dev sandbox environment
const origConsoleError = console.error;
const origConsoleWarn = console.warn;

console.error = (...args) => {
  const msg = args.map((a) => String(a?.message || a || '')).join(' ');
  if (msg.includes('WebSocket') || msg.includes('closed without opened') || msg.includes('[vite] failed to connect')) {
    return;
  }
  origConsoleError.apply(console, args);
};

console.warn = (...args) => {
  const msg = args.map((a) => String(a?.message || a || '')).join(' ');
  if (msg.includes('WebSocket') || msg.includes('closed without opened') || msg.includes('[vite]')) {
    return;
  }
  origConsoleWarn.apply(console, args);
};

window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = String(event.reason?.message || event.reason || '');
  if (
    reasonStr.includes('WebSocket') ||
    reasonStr.includes('closed without opened') ||
    reasonStr.includes('vite')
  ) {
    event.preventDefault();
    event.stopImmediatePropagation?.();
  }
});

window.addEventListener('error', (event) => {
  const errStr = String(event.message || event.error || '');
  if (
    errStr.includes('WebSocket') ||
    errStr.includes('closed without opened') ||
    errStr.includes('[vite]')
  ) {
    event.preventDefault();
    event.stopImmediatePropagation?.();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

