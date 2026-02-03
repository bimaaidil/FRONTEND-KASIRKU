import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// --- TAMBAHKAN BARIS INI (Sangat Penting) ---
import 'bootstrap/dist/css/bootstrap.min.css';
// --------------------------------------------

import './index.css' // Pastikan file ini KOSONG agar tidak merusak layout
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)