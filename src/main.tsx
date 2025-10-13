import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AdaptersProvider } from './features/adapters/infra'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdaptersProvider>
      <App />
    </AdaptersProvider>
  </StrictMode>,
)
