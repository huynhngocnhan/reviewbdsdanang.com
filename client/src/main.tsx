import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './index.css'
import App from './App.tsx'

AOS.init({
  duration: 800,
  once: true,
  offset: 100,
  easing: 'ease-out-cubic',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="bottom-right"
  reverseOrder={false} toastOptions={{ duration: 3000 }} />
  </StrictMode>,
)
