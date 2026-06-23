import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import translations from '../lib/i18n'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })

  const switchLanguage = useCallback((newLang) => {
    setLang(newLang)
    localStorage.setItem('language', newLang)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('lang', lang)

    if (lang === 'bn') {
      if (!document.getElementById('hind-siliguri-font')) {
        const link = document.createElement('link')
        link.id = 'hind-siliguri-font'
        link.rel = 'stylesheet'
        link.href = 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap'
        document.head.appendChild(link)
      }
    } else {
      const existing = document.getElementById('hind-siliguri-font')
      if (existing) existing.remove()
    }
  }, [lang])

  const t = useCallback((key) => {
    const keys = key.split('.')
    let value = translations[lang]
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }
    return typeof value === 'string' ? value : key
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}

export default LanguageContext
