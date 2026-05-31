import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n.js'
import App from './App.jsx'
import { NotifyProvider } from './components/Notify.jsx'

createRoot(document.getElementById('root')).render(
  <NotifyProvider>
    <App />
  </NotifyProvider>
)
