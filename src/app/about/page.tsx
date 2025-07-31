import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      bio: "Former Google PM who struggled with habit formation despite trying every app. Built I Bet You Can't after losing $45 to a friend in a personal accountability bet - and finally sticking to daily meditation for 30 days.",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez", 
      role: "Head of Psychology",
      bio: "PhD in Behavioral Psychology from Stanford. Expert in loss aversion and commitment devices. Previously researched habit formation at the Stanford Behavior Design Lab.",
      avatar: "MR"
    },
    {
      name: "Alex Kim",
      role: "Lead Engineer",
      bio: "Former Stripe engineer who built payment systems for millions of users. Ensures your money is handled with bank-level security and returned instantly upon success.",
      avatar: "AK"
    }
  ]

  const stats = [
    { label: "Users Committed", value: "12,847", description: "People who put their money where their mouth is" },
    { label: "Challenges Completed", value: "8,432", description: "Successful habit formations with money returned" },
    { label: "Success Rate", value: "66%", description: "Higher than any traditional habit app" },
    { label: "Money at Stake", value: "$192,705", description: "Total committed by our community" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-foreground mt-4 mb-6">
            About I Bet You Can&apos;t
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We&apos;re on a mission to help people build lasting habits using the most powerful motivator: 
            the fear of losing their own money.
          </p>
        </div>

        {/* Our Story */}
        <Card variant="elevated" className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-600 dark:text-gray-400">
            <p className="text-lg leading-relaxed">
              I Bet You Can&apos;t was born from frustration. Our founder, Sarah, had tried every habit app, 
              productivity system, and self-help book. Nothing stuck. Then a friend challenged her: 
              "I bet you can&apos;t meditate every day for 30 days. Put $50 on it."
            </p>
            <p className="text-lg leading-relaxed">
              Sarah took the bet - and succeeded. For the first time in years, she built a habit that lasted. 
              The fear of losing money to her friend was more motivating than any streak counter or achievement badge.
            </p>
            <p className="text-lg leading-relaxed">
              That&apos;s when she realized: <strong>loss aversion isn&apos;t a bug in human psychology, it&apos;s a feature.</strong> 
              We&apos;re hardwired to avoid losses more than we seek gains. Traditional habit apps fight against this 
              basic human nature. We embrace it.
            </p>
            <p className="text-lg leading-relaxed">
              Today, thousands of people have used I Bet You Can&apos;t to build lasting habits. Our success rate 
              is 2-3x higher than traditional apps because we work with human psychology, not against it.
            </p>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card variant="outlined" className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Our Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="font-semibold text-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card variant="elevated" className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 dark:text-blue-200">
              <p className="leading-relaxed">
                To help people build lasting habits by aligning financial incentives with personal goals. 
                We believe the fear of loss is a more powerful motivator than the promise of gain, 
                and we&apos;ve built a platform that makes this psychology work for you, not against you.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-900 dark:text-green-100">Our Values</CardTitle>
            </CardHeader>
            <CardContent className="text-green-800 dark:text-green-200">
              <ul className="space-y-2">
                <li><strong>Radical Honesty:</strong> No exceptions, no excuses, no participation trophies</li>
                <li><strong>Financial Integrity:</strong> Your money is secure and returned fairly</li>
                <li><strong>Psychological Science:</strong> Evidence-based approach to behavior change</li>
                <li><strong>User Success:</strong> We win when you build lasting habits</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Team */}
        <Card variant="elevated" className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Meet Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{member.avatar}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">{member.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Science Behind It */}
        <Card variant="outlined" className="mb-12 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="text-yellow-900 dark:text-yellow-100">The Science Behind Our Approach</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-yellow-800 dark:text-yellow-200">
            <div>
              <h4 className="font-semibold mb-2">Loss Aversion (Kahneman & Tversky, 1979)</h4>
              <p className="text-sm">
                People feel the pain of losing something twice as strongly as the pleasure of gaining the same thing. 
                This is why losing $15 motivates you more than earning $15.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Commitment Devices (Thaler & Sunstein, 2008)</h4>
              <p className="text-sm">
                Putting constraints on your future self helps overcome present bias and procrastination. 
                Financial stakes create powerful commitment devices.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Implementation Intentions (Gollwitzer, 1999)</h4>
              <p className="text-sm">
                Specific "if-then" plans significantly improve goal achievement. Our check-in system 
                creates clear implementation intentions for habit formation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security & Trust */}
        <Card variant="elevated" className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Security & Trust</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Payment Security
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All payments processed by Stripe with bank-level encryption. We never see or store your card details. 
                  Your money is held in secure escrow and returned automatically upon completion.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-.257-.257A6 6 0 0118 8zM2 8a6 6 0 1010.743 5.743L12 14l-.257-.257A6 6 0 002 8zm8 2a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Data Privacy
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  GDPR compliant with minimal data collection. We only store what&apos;s necessary for the service. 
                  No selling data, no invasive tracking, no ads.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card variant="elevated" className="text-center bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Put Your Money Where Your Commitment Is?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Join thousands of people who have successfully built lasting habits using the power of loss aversion. 
              Your habit. Your timeline. Your money on the line.
            </p>
            <Button asChild variant="challenge" size="lg">
              <Link href="/auth/signup">
                Start Your Challenge Today
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}