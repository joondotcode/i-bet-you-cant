'use client';

import { routing, type Locale } from '@/i18n/routing';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const LOCALE_STORAGE_KEY = 'user-locale';

// Client-side locale management
export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') {
    return routing.defaultLocale;
  }

  // Try localStorage first
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && routing.locales.includes(stored as Locale)) {
    return stored as Locale;
  }

  // Fallback to browser language
  const browserLang = navigator.language || navigator.languages?.[0];
  const matchedLocale = routing.locales.find(locale => 
    browserLang.startsWith(locale) || browserLang.startsWith('ko') && locale === 'ko'
  );

  return matchedLocale || routing.defaultLocale;
}

export function setStoredLocale(locale: Locale) {
  if (typeof window === 'undefined') return;

  // Store in localStorage for client-side persistence
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);

  // Set cookie for server-side access
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

  // Reload page to apply new locale
  window.location.reload();
}

// Server Action for setting locale cookie
export async function setLocaleCookie(locale: Locale) {
  'use server';
  
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
}