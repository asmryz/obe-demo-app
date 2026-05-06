import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NotifyProvider } from './components/Notify.jsx'

createRoot(document.getElementById('root')).render(
  <NotifyProvider>
    <App />
  </NotifyProvider>
)
