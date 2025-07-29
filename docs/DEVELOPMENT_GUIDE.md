# Development Guide

> **⚠️ FOUNDATION PHASE** - This project is in early development. Many features described below are planned but not yet implemented. Use this guide as a roadmap for implementation.

## Project Setup

### Prerequisites
- Node.js 18+ with npm
- Git for version control
- Supabase account (free tier sufficient for development)
- Stripe account (test mode for development)

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd i-bet-you-cant

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### Environment Configuration

Create `.env.local` with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe Configuration (Test Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # For webhook testing

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy URL and anon key to `.env.local`

2. **Run Database Migrations**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Initialize Supabase in project
   supabase init

   # Link to your project
   supabase link --project-ref your-project-ref

   # Apply database schema
   supabase db reset
   ```

3. **Set Row Level Security (RLS)**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
   ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
   ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

   -- Example policies (add to Supabase SQL editor)
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);
   ```

## Development Workflow

### Starting Development Server
```bash
# Start with turbopack (faster builds)
npm run dev

# Build for production testing
npm run build && npm start

# Run linting
npm run lint
```

### Code Organization

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth-related pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── features/         # Feature-specific components
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase client & utils
│   ├── stripe/           # Stripe integration
│   ├── utils/            # General utilities
│   └── validations/      # Zod schemas
├── hooks/                # Custom React hooks
├── store/                # Zustand state management
└── types/                # TypeScript type definitions
```

### Key Development Patterns

#### Database Operations
```typescript
// Use server-side client for API routes
import { createClient } from '@/lib/supabase/server'

// Use browser client for client components
import { createClient } from '@/lib/supabase/client'

// Example: Fetching user challenges
const supabase = createClient()
const { data: challenges, error } = await supabase
  .from('challenges')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

#### Payment Integration
```typescript
// Create payment intent
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const paymentIntent = await stripe.paymentIntents.create({
  amount: 1500, // $15.00 in cents
  currency: 'usd',
  metadata: {
    challengeId: challenge.id,
    userId: user.id
  }
})
```

#### Error Handling
```typescript
// API route error handling
try {
  const result = await performOperation()
  return NextResponse.json({ success: true, data: result })
} catch (error) {
  console.error('Operation failed:', error)
  return NextResponse.json(
    { success: false, error: 'Operation failed' },
    { status: 500 }
  )
}
```

## Testing Strategy

### Unit Testing (Future)
```bash
# Install testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### Integration Testing
- Test API routes with sample data
- Verify Stripe webhook handling
- Test Supabase queries and RLS policies

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Challenge creation with payment
- [ ] Daily check-in functionality
- [ ] Challenge completion/failure flows
- [ ] Payment refund/forfeiture
- [ ] Time zone handling

## Deployment Considerations

### Environment Variables (Production)
```env
# Production Supabase
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key

# Production Stripe (Live Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Production App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Database Migration Strategy
1. Test migrations in staging environment
2. Backup production database before changes
3. Run migrations during low-traffic periods
4. Monitor for errors post-deployment

### Monitoring & Logging
- Set up Stripe webhook monitoring
- Implement application logging
- Monitor daily cron job execution
- Track payment success/failure rates

## Troubleshooting

### Common Issues

**Supabase Connection Errors**
- Verify environment variables are correct
- Check RLS policies aren't blocking queries
- Ensure database is accessible from your IP

**Stripe Integration Issues**
- Confirm test/live key consistency
- Verify webhook endpoints are reachable
- Check Stripe dashboard for failed events

**Time Zone Problems**
- Always store UTC timestamps in database
- Convert to user timezone in UI only
- Test edge cases around daylight saving time

### Debug Commands
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test Supabase connection
npx supabase test db

# Verify Stripe webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Contributing Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Use Prettier for code formatting

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/challenge-creation

# Make commits with clear messages
git commit -m "feat: add challenge creation form"

# Push and create pull request
git push origin feature/challenge-creation
```

### Pull Request Process
1. Ensure all tests pass
2. Update documentation if needed
3. Add screenshots for UI changes
4. Request review from team members

### Database Changes
- Create migration files for schema changes
- Test migrations on copy of production data
- Document any breaking changes
- Update API documentation accordingly