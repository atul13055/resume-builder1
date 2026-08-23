import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { SpellCheckProvider } from './components/Editor/SpellCheckContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SpellCheckProvider>
        <App />
      </SpellCheckProvider>
    </AuthProvider>
  </StrictMode>,
);

