import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from './context/CartContext.tsx';
import { initEmailJS } from './services/emailService.ts';
import App from './App.tsx';
import './index.css';

// Inicializar EmailJS
initEmailJS();

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
