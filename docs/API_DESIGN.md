# API Design & Database Schema

> **⚠️ PLANNED ARCHITECTURE** - This document describes the intended API structure and database schema. **None of these endpoints or tables currently exist** and require implementation.

## Database Schema

### Users Table (Supabase Auth)
```sql
-- Handled by Supabase Auth
-- Additional user metadata can be stored in profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Challenges Table
```sql
CREATE TABLE challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL CHECK (duration_days IN (7, 14, 30)),
  stake_amount INTEGER DEFAULT 1500, -- $15.00 in cents
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'cancelled')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Payment tracking
  stripe_payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'forfeited')),
  
  -- Business logic constraints
  CONSTRAINT valid_date_range CHECK (end_date = start_date + (duration_days - 1) * INTERVAL '1 day')
);

-- Ensure one active challenge per user
CREATE UNIQUE INDEX one_active_challenge_per_user 
ON challenges (user_id) 
WHERE status = 'active';
```

### Check-ins Table
```sql
CREATE TABLE checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  checkin_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  photo_url TEXT,
  
  -- Ensure one checkin per day per challenge
  UNIQUE(challenge_id, checkin_date)
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  refunded_at TIMESTAMP WITH TIME ZONE,
  refund_amount INTEGER
);
```

## API Routes (Next.js App Router)

### Authentication
```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/user
```

### Challenges
```
GET    /api/challenges          # List user's challenges
POST   /api/challenges          # Create new challenge
GET    /api/challenges/[id]     # Get challenge details
PUT    /api/challenges/[id]     # Update challenge
DELETE /api/challenges/[id]     # Cancel challenge

# Challenge status
GET    /api/challenges/[id]/status    # Get current status
GET    /api/challenges/[id]/checkins  # Get all checkins for challenge
```

### Check-ins
```
POST /api/checkins              # Create daily check-in
GET  /api/checkins/[id]         # Get specific check-in
PUT  /api/checkins/[id]         # Update check-in (notes/photo)
```

### Payments
```
POST /api/payments/create-intent     # Create Stripe PaymentIntent
POST /api/payments/confirm          # Confirm payment
POST /api/payments/refund           # Process refund
GET  /api/payments/status/[id]      # Get payment status
```

### Webhooks
```
POST /api/webhooks/stripe           # Handle Stripe webhooks
POST /api/webhooks/daily-check      # Daily challenge evaluation (cron)
```

## API Response Formats

### Success Response
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}
```

### Error Response
```typescript
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Challenge Object
```typescript
interface Challenge {
  id: string;
  userId: string;
  title: string;
  description?: string;
  durationDays: 7 | 14 | 30;
  stakeAmount: number; // cents
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  startDate: string; // ISO date
  endDate: string; // ISO date
  createdAt: string;
  updatedAt: string;
  
  // Payment info
  stripePaymentIntentId?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'forfeited';
  
  // Computed fields
  daysRemaining?: number;
  daysCompleted?: number;
  missedDays?: number;
  completionRate?: number;
}
```

### Check-in Object
```typescript
interface Checkin {
  id: string;
  challengeId: string;
  userId: string;
  checkinDate: string; // ISO date
  completedAt: string; // ISO datetime
  notes?: string;
  photoUrl?: string;
}
```

## Background Jobs & Automation

### Daily Challenge Evaluation
```typescript
// Function: evaluateChallenges()
// Frequency: Daily at 12:01 AM UTC
// Purpose: Check for missed days and update challenge status

interface DailyEvaluation {
  challengeId: string;
  expectedCheckinDate: string;
  hasCheckin: boolean;
  action: 'none' | 'mark_failed' | 'complete_challenge';
}
```

### Payment Processing
```typescript
// Function: processRefunds()
// Trigger: When challenge status changes to 'completed'
// Purpose: Refund successful challenges

// Function: processForfeitures()  
// Trigger: When challenge status changes to 'failed'
// Purpose: Mark payment as forfeited, handle funds
```

## Business Logic Rules

### Challenge Creation
1. User must not have an active challenge
2. Payment must be confirmed before challenge becomes active
3. Start date cannot be in the past
4. Duration must be 7, 14, or 30 days

### Daily Check-ins
1. Can only check in once per calendar day
2. Check-in must be within challenge date range
3. Late check-ins (after 11:59 PM local time) not allowed
4. Photo upload is optional but encouraged

### Challenge Completion
1. Success: Check-in exists for every day in range
2. Failure: Any missing day results in failure
3. Status evaluation runs daily via cron job
4. No manual intervention required for status changes

### Payment Rules
1. $15 stake required for all challenges
2. Funds held in Stripe until resolution
3. Successful completion: 100% refund
4. Failure: Funds forfeited (platform revenue)
5. Cancellation: Refund minus processing fees (if applicable)