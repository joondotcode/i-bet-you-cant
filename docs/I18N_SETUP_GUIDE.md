# Internationalization Setup Guide

## Overview

Your "I Bet You Can't" app now supports comprehensive internationalization using next-intl with Next.js 15 App Router. This setup provides type-safe translations, server-side rendering, and optimal performance.

## Supported Locales

- **en-US**: English (United States) - USD, MM/DD/YYYY, 12-hour time
- **es-ES**: Spanish (Spain) - EUR, DD/MM/YYYY, 24-hour time  
- **fr-FR**: French (France) - EUR, DD/MM/YYYY, 24-hour time

## Architecture

### Core Files Created

```
src/
├── i18n/
│   ├── routing.ts          # Locale routing configuration
│   ├── request.ts          # Server-side i18n configuration
│   └── navigation.ts       # Type-safe navigation helpers
├── messages/
│   ├── en-US.json         # English translations
│   ├── es-ES.json         # Spanish translations
│   └── fr-FR.json         # French translations
├── lib/i18n/
│   └── utils.ts           # Formatting & RTL utilities
├── components/i18n/
│   └── locale-switcher.tsx # Locale switching component
└── middleware.ts          # Route handling middleware
```

### App Structure

```
src/app/
├── [locale]/              # Locale-based routing
│   ├── layout.tsx        # Localized layout with metadata
│   ├── page.tsx          # Home page
│   ├── about/            # Localized pages
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   └── faq/              # FAQ page
├── api/                  # API routes (locale-agnostic)
├── layout.tsx            # Root layout (minimal)
└── globals.css           # Global styles
```

## Key Features

### 1. ICU Message Formatting
- **Pluralization**: `{count, plural, =1 {1 day} other {# days}}`
- **Number Formatting**: `{amount, number, currency}`
- **Rich Text**: `{termsLink}` for embedded links
- **Select Formatting**: `{gender, select, male {He} female {She} other {They}}`

### 2. Currency Localization
- Automatic currency conversion display
- Locale-appropriate currency symbols
- Position-aware formatting (€ after vs $ before)

### 3. Date & Time Formatting
- Locale-specific date formats (MM/DD vs DD/MM)
- 12/24-hour time preferences
- Relative time formatting ("2 days ago")
- Week start preferences (Sunday vs Monday)

### 4. SEO Optimization
- Localized URLs (`/about` → `/acerca-de` in Spanish)
- Proper hreflang tags
- Locale-specific metadata
- Sitemap generation support

## Usage Examples

### Basic Translation Hook
```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('Common');
  return <button>{t('save')}</button>;
}
```

### Server Component Translation
```tsx
import { getTranslations } from 'next-intl/server';

export default async function ServerPage() {
  const t = await getTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

### Navigation with Locale
```tsx
import { Link } from '@/i18n/navigation';

function Navigation() {
  return (
    <Link href="/about">
      About Us
    </Link>
  );
}
```

### Currency Formatting
```tsx
import { formatCurrency } from '@/lib/i18n/utils';
import { useLocale } from 'next-intl';

function PriceDisplay({ amount }: { amount: number }) {
  const locale = useLocale();
  return <span>{formatCurrency(amount, locale)}</span>;
}
```

## Best Practices

### 1. Translation Keys
- Use nested keys: `"Auth.loginTitle"` not `"authLoginTitle"`
- Be descriptive: `"passwordTooShort"` not `"error1"`
- Group by context: `Common`, `Auth`, `Challenge`, etc.

### 2. ICU Formatting
- Always use ICU for plurals: `{count, plural, =1 {1 item} other {# items}}`
- Use variables for dynamic content: `"Welcome back, {name}!"`
- Provide context for translators: `"title": "Page title (max 60 characters)"`

### 3. Cultural Adaptation
- Consider number formats (1,000.00 vs 1 000,00)
- Date preferences (MM/DD vs DD/MM)
- Currency symbols and positions
- Color associations (red = danger in Western cultures, luck in Chinese)
- Reading direction (RTL support ready)

### 4. Performance
- Use `getTranslations` in Server Components when possible
- Only load necessary namespaces per page
- Tree-shake unused translations in production

## Critical Pitfalls Avoided

### ❌ String Concatenation
```tsx
// DON'T DO THIS - breaks grammar in many languages
const message = t('you_have') + ' ' + count + ' ' + t('items');
```

### ✅ ICU Complete Sentences
```tsx
// DO THIS - proper grammar support
const message = t('itemCount', { count });
// Translation: "You have {count, plural, =1 {1 item} other {# items}}"
```

### ❌ Hardcoded Formatting
```tsx
// DON'T - assumes US formatting
const price = '$' + amount.toFixed(2);
```

### ✅ Locale-Aware Formatting
```tsx
// DO THIS - respects locale conventions
const price = formatCurrency(amount, locale);
```

### ❌ Missing Context
```tsx
// DON'T - ambiguous words
"close": "Close" // Close door? Close application? Close relationship?
```

### ✅ Contextual Keys
```tsx
// DO THIS - clear context
"closeDialog": "Close",
"closeAccount": "Close Account",
"closeRelationship": "End Relationship"
```

## Deployment Considerations

### Environment Variables
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Build Configuration
The middleware automatically handles:
- Locale detection from URL
- Fallback to default locale
- SEO-friendly redirects

### CDN Configuration
Ensure your CDN respects:
- `Accept-Language` headers
- Locale-specific URLs
- Static file caching per locale

## Adding New Locales

1. Add locale to `routing.ts`:
```ts
locales: ['en-US', 'es-ES', 'fr-FR', 'de-DE']
```

2. Create translation file: `src/messages/de-DE.json`

3. Add currency/date config to `utils.ts`:
```ts
CURRENCY_CONFIG: {
  'de-DE': { currency: 'EUR', symbol: '€', position: 'after' }
}
```

4. Update locale switcher component

## Testing Strategy

1. **Unit Tests**: Test translation key usage
2. **Integration Tests**: Verify locale switching
3. **E2E Tests**: Test complete user flows per locale
4. **Accessibility Tests**: Ensure proper lang attributes
5. **SEO Tests**: Verify hreflang and metadata

## Performance Monitoring

Monitor these metrics per locale:
- Page load times
- Translation loading errors  
- Currency conversion accuracy
- User engagement by locale

## Future Extensions

Ready for:
- **RTL Languages**: Arabic, Hebrew support
- **Locale-Specific Features**: Payment methods, shipping
- **A/B Testing**: Different messaging per culture
- **Dynamic Translations**: User-generated content translation
- **Voice/Audio**: Text-to-speech localization

Your i18n setup is production-ready with industry best practices, avoiding common pitfalls, and optimized for your habit-building app's specific needs.