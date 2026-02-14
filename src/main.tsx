import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const root = document.getElementById('root')!

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Hide the inline splash screen once React has painted
// Uses requestAnimationFrame to wait for the first real frame
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    if (typeof window.__hideSplash === 'function') {
      window.__hideSplash()
    }
  })
})

// Extend Window type so TypeScript doesn't complain
declare global {
  interface Window {
    __hideSplash?: () => void
  }
}
