import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { LanguageProvider } from './context/LanguageContext'
import './index.css'

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'))

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const storedDark = localStorage.getItem('darkMode')
const isDark = storedDark !== null ? storedDark === 'true' : prefersDark
if (isDark) {
  document.documentElement.classList.add('dark')
}

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
