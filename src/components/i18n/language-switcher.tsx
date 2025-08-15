'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useTransition } from 'react'
import { ChevronDown } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
] as const

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  const switchLanguage = (newLocale: string) => {
    // Set cookie for server-side rendering
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=lax`
    
    startTransition(() => {
      // Navigate to the same page but with new locale
      const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`)
      router.push(newPathname)
      router.refresh()
    })
    
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="group relative px-3 py-2 bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 hover:text-white rounded-lg font-medium text-sm transition-all duration-300 border border-slate-600/40 hover:border-slate-500/60 shadow-sm hover:shadow-md backdrop-blur-sm overflow-hidden min-w-[100px]"
        aria-label="Switch language"
      >
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
        
        {/* Button content */}
        <span className="relative flex items-center justify-center gap-2">
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Switching...</span>
            </>
          ) : (
            <>
              <span className="text-base" role="img" aria-label={currentLanguage.name}>
                {currentLanguage.flag}
              </span>
              <span className="hidden sm:inline truncate">
                {currentLanguage.name}
              </span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </>
          )}
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown content */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-600/40 z-20 overflow-hidden">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => switchLanguage(language.code)}
                  disabled={isPending}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-700/60 transition-colors duration-200 flex items-center gap-3 ${
                    language.code === locale 
                      ? 'bg-slate-700/40 text-neon-green' 
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  <span className="text-lg" role="img" aria-label={language.name}>
                    {language.flag}
                  </span>
                  <span className="font-medium">
                    {language.name}
                  </span>
                  {language.code === locale && (
                    <div className="ml-auto w-2 h-2 bg-neon-green rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}