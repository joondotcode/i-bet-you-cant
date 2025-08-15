import type { Locale } from '@/i18n/routing';

// Currency configuration by locale
export const CURRENCY_CONFIG: Record<Locale, { currency: string; symbol: string; position: 'before' | 'after' }> = {
  'en': { currency: 'USD', symbol: '$', position: 'before' },
  'ko': { currency: 'KRW', symbol: '₩', position: 'before' },
};

export function getCurrencyConfig(locale: Locale) {
  return CURRENCY_CONFIG[locale] || CURRENCY_CONFIG['en'];
}

// Date format preferences by locale
export const DATE_FORMAT_CONFIG: Record<Locale, { 
  dateFormat: string; 
  timeFormat: '12h' | '24h';
  weekStart: 0 | 1; // 0 = Sunday, 1 = Monday
}> = {
  'en': { dateFormat: 'MM/dd/yyyy', timeFormat: '12h', weekStart: 0 },
  'ko': { dateFormat: 'yyyy.MM.dd', timeFormat: '24h', weekStart: 1 },
};

export function getDateFormatConfig(locale: Locale) {
  return DATE_FORMAT_CONFIG[locale] || DATE_FORMAT_CONFIG['en'];
}

// Number formatting helpers
export function formatCurrency(
  amount: number, 
  locale: Locale,
  options?: { showSymbol?: boolean }
): string {
  const config = getCurrencyConfig(locale);
  const { showSymbol = true } = options || {};
  
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  if (!showSymbol) {
    return formatter.format(amount).replace(/[^\d.,]/g, '').trim();
  }
  
  return formatter.format(amount);
}

export function formatNumber(
  number: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(number);
}

// Validation helpers
export function validateEmailByLocale(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getPlaceholdersByLocale(locale: Locale) {
  const config = getDateFormatConfig(locale);
  
  return {
    date: config.dateFormat.toLowerCase(),
    email: locale === 'ko' ? 'example@example.com' : 'email@example.com',
    phone: locale === 'ko' ? '+82 10-0000-0000' : '+1 (555) 000-0000'
  };
}