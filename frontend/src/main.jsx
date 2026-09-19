import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import './styles/global.css';
import './styles/brand.css';
import './styles/accessibility.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider><BrowserRouter>
      <ToastProvider>
        <AuthProvider><App /></AuthProvider>
      </ToastProvider>
    </BrowserRouter></LanguageProvider>
  </StrictMode>
);
