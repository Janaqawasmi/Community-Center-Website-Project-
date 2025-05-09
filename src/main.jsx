// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { SectionProvider } from './components/SectionContext'; // ✅ Import this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SectionProvider> 
        <App />
      </SectionProvider>
    </BrowserRouter>
  </StrictMode>
);
