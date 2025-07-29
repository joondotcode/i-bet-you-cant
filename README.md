# 📱 I Bet You Can't

A habit-enforcing accountability app that leverages loss aversion psychology to drive consistency. Users stake $15 to commit to completing daily tasks for set durations, getting their money back only if they complete every single day.

## 🎯 Core Concept

**The Challenge**: Complete a daily task for 7-30 days without missing a single day
**The Stakes**: $15 held in escrow - get it back on success, lose it on failure
**The Psychology**: Loss aversion motivates consistency better than rewards alone

## ✨ Features (MVP)

### 🚀 User Journey
1. **Sign Up & Goal Setting** - Create account and define daily challenge
2. **Payment & Commitment** - Stake $15 via Stripe Checkout  
3. **Daily Check-ins** - Complete task and check in within 24-hour window
4. **Challenge Resolution** - Success = full refund, failure = funds forfeited

### 🔧 Core Functionality
- **One Challenge Rule**: Users can only run one active challenge at a time
- **Zero Tolerance**: Missing even one day results in automatic failure
- **Time Enforcement**: Check-ins must occur within calendar day boundaries
- **Proof Optional**: Users can upload photos or add journal notes

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router & React 19
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Payments**: Stripe (Checkout + Transfer API)  
- **Styling**: Tailwind CSS 4
- **State**: Zustand
- **TypeScript**: Strict mode enabled

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Stripe account

### Installation

```bash
# Clone and install
git clone <repo-url>
cd i-bet-you-cant
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and Stripe keys
```

### Development

```bash
# Start development server with turbopack
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your_cron_secret
```

## 🏗 Architecture

### Business Logic Flow
```
User Registration → Challenge Creation → Payment Escrow → Daily Check-ins → Challenge Resolution
```

### Key Components (Planned)
- **Challenge Engine**: Daily status evaluation and failure detection
- **Payment System**: Stripe integration for escrow and refunds
- **Time Management**: UTC/local time handling for daily boundaries
- **Background Jobs**: Cron jobs for automated challenge evaluation

### Database Schema (Planned)
- Users (auth via Supabase)
- Challenges (task, duration, status, dates)
- Check-ins (daily completion records)
- Payments (Stripe payment tracking)

## 🚧 Current Project Status

**⚠️ EARLY DEVELOPMENT PHASE** - This project is currently in the foundation setup stage. The documentation below represents the planned architecture and features, but most functionality is not yet implemented.

## 📊 Implementation Status

### Phase 1: Foundation Setup (25% Complete)
- [x] Project scaffolding with Next.js 15 + React 19
- [x] Supabase client configuration
- [x] Stripe packages installed
- [x] Tailwind CSS 4 setup
- [x] TypeScript configuration
- [ ] **Database schema creation** (SQL migrations needed)
- [ ] **User authentication system** (Supabase Auth integration)
- [ ] **API routes structure** (No API endpoints exist yet)
- [ ] **Basic UI components** (Only default Next.js page exists)

### Phase 2: Core Features (0% Complete)
- [ ] Challenge creation system
- [ ] Stripe payment integration
- [ ] Daily check-in functionality
- [ ] Challenge status evaluation
- [ ] Time zone handling

### Phase 3: Automation (0% Complete)
- [ ] Background job system
- [ ] Automated failure detection
- [ ] Payment processing (refunds/forfeitures)

## 🎯 Next Development Priorities

### Immediate Next Steps
1. **Database Setup** - Create Supabase tables and migrations
2. **Authentication** - Implement Supabase Auth with protected routes
3. **Basic API Structure** - Create foundation API routes
4. **Challenge Creation Flow** - MVP challenge creation without payments

### Future Milestones
- **Payment Integration** - Stripe checkout and webhook handling
- **Daily Check-ins** - Core habit tracking functionality
- **Background Jobs** - Automated challenge evaluation
- **Enhanced Features** - Photo uploads, statistics, mobile optimization

## 🔮 Future Enhancements

- **Charity Integration**: Forfeited funds donated to charity
- **Social Features**: Leaderboards and challenge sharing
- **Partner Mode**: Users bet against each other
- **AI Coach**: Motivational messaging system
- **Mobile App**: React Native implementation

## 💡 Key Business Rules

- **Calendar Day Logic**: Check-ins must occur within calendar day boundaries
- **Single Challenge Limit**: One active challenge per user (MVP constraint)
- **Zero Tolerance Policy**: Missing any day results in immediate failure
- **Payment Hold**: Funds held until challenge completion or failure
- **Time Window**: Daily check-ins have 24-hour windows (e.g., 5AM-11:59PM)

## 📚 Development Notes

- Use UTC for server-side date calculations
- Store user timezone for UI display
- Implement proper error handling for payment flows
- Consider edge cases around daylight saving time
- Stripe metadata should include user_id, challenge_id, and status
