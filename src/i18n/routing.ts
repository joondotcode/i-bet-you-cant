import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Supported locales - English and Korean
  locales: ['en', 'ko'],
  
  // Default locale (no prefix in URLs)
  defaultLocale: 'en',
  
  // Locale prefix strategy - 'always' means all locales get prefixes 
  localePrefix: 'always',
  
  // Optional: Define localized pathnames for better SEO
  pathnames: {
    '/': '/',
    '/about': {
      'en': '/about',
      'ko': '/about'
    },
    '/faq': {
      'en': '/faq',
      'ko': '/faq'
    },
    '/dashboard': '/dashboard',
    '/dashboard/challenges/new': {
      'en': '/dashboard/challenges/new',
      'ko': '/dashboard/challenges/new'
    },
    '/auth/login': {
      'en': '/auth/login',
      'ko': '/auth/login'
    },
    '/auth/signup': {
      'en': '/auth/signup',
      'ko': '/auth/signup'
    }
  }
});

// Export locale type for type safety
export type Locale = typeof routing.locales[number];