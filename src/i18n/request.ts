import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import type { Locale } from './routing';

export default getRequestConfig(async () => {
  // Get locale from cookie (set by user preference)
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  
  const locale = hasLocale(routing.locales, cookieLocale)
    ? (cookieLocale as Locale)
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // Configure global formats for consistency
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        },
        medium: {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        },
        long: {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        },
        time: {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }
      },
      number: {
        currency: {
          style: 'currency',
          currency: locale === 'en' ? 'USD' : locale === 'ko' ? 'KRW' : 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        },
        precise: {
          maximumFractionDigits: 2
        },
        percentage: {
          style: 'percent',
          maximumFractionDigits: 0
        }
      },
      list: {
        enumeration: {
          style: 'long',
          type: 'conjunction'
        }
      }
    },
    // Default timezone
    timeZone: 'UTC',
    // Configure ICU message syntax
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('next-intl error:', error);
      }
    }
  };
});