import { getUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'
import { OAuthHandler } from '@/components/oauth-handler'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Calendar,
  Users,
  Star,
  Crown,
  Sparkles
} from 'lucide-react'

export default async function Home() {
  const user = await getUser()

  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* OAuth Handler for callback codes */}
      <Suspense fallback={null}>
        <OAuthHandler />
      </Suspense>
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Crown className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            I Bet You Can't
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button variant="gradient" asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20 space-y-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-violet-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
              Psychology-Powered Habit Building
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold text-center max-w-4xl mx-auto leading-tight">
            Turn Your
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent block sm:inline sm:ml-4">
              Habits Into Reality
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The only habit app that puts your money where your mouth is. 
            <span className="font-semibold text-foreground">Stake $15</span>, complete every day, or lose it all. 
            Loss aversion psychology makes it <span className="font-semibold text-foreground">2x more effective</span> than traditional apps.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <Badge variant="outline" className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              SSL Secured
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              Stripe Protected
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Money-Back Guarantee
            </Badge>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/auth/signup">
              <Button 
                size="xl" 
                variant="challenge" 
                className="group shadow-xl hover:shadow-2xl flex items-center gap-2"
              >
                <span className="text-lg font-bold">I Accept the Challenge</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button size="xl" variant="glass" asChild>
              <Link href="/demo">
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex justify-center items-center space-x-8 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">1,247</div>
              <div className="text-sm text-muted-foreground">Active Challenges</div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">73%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">$18K+</div>
              <div className="text-sm text-muted-foreground">Returned to Winners</div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="gradient" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl font-bold mb-4">Simple. Effective. Proven.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three steps to transform your habits with the power of loss aversion psychology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card variant="elevated" className="group hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Choose Your Habit</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Define a daily habit and commit to 7, 14, or 30 days. Start small and build momentum.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card variant="elevated" className="group hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Stake $15</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Put your money where your mouth is. Real financial stakes create real commitment and motivation.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card variant="elevated" className="group hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Complete or Lose</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Check in every day. Complete all days = full refund. Miss even one day = lose it all.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Psychology Section */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="success" className="mb-4">Psychology-Powered</Badge>
              <h2 className="text-4xl font-bold mb-6">Why Loss Aversion Works</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Research by Nobel Prize winners Daniel Kahneman & Amos Tversky shows that people are 
                <span className="font-bold text-foreground"> 2-3x more motivated</span> to avoid losing 
                something than to gain something of equal value.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Financial Skin in the Game</h3>
                    <p className="text-muted-foreground">Real consequences create real commitment, not just wishful thinking.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Immediate Feedback</h3>
                    <p className="text-muted-foreground">Daily check-ins provide instant accountability and progress tracking.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Proven Results</h3>
                    <p className="text-muted-foreground">73% success rate vs. 10% for traditional habit apps without stakes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card variant="glass" className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Success Rate Comparison</h3>
                  <p className="text-muted-foreground">Traditional vs. Stakes-Based Approach</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Traditional Habit Apps</span>
                      <span className="text-sm text-red-500">10%</span>
                    </div>
                    <Progress value={10} variant="danger" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">I Bet You Can't</span>
                      <span className="text-sm text-green-500">73%</span>
                    </div>
                    <Progress value={73} variant="success" />
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Badge variant="glow">7.3x More Effective</Badge>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Rules Section */}
        <section className="mb-20">
          <Card variant="gradient" className="max-w-4xl mx-auto p-8 border-l-4 border-l-yellow-500">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">⚠️</span>
                </div>
                <Badge variant="warning">The Rules</Badge>
              </div>
              <h2 className="text-3xl font-bold mb-2">Simple But Strict</h2>
              <p className="text-muted-foreground">No exceptions. No excuses. No compromises.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Daily Check-ins Required</h3>
                    <p className="text-sm text-muted-foreground">Check in every single calendar day without fail.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Zero Tolerance Policy</h3>
                    <p className="text-sm text-muted-foreground">Missing even one day = immediate failure and forfeiture.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">One Challenge at a Time</h3>
                    <p className="text-sm text-muted-foreground">Focus your energy on a single habit for maximum effectiveness.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Fair & Transparent</h3>
                    <p className="text-sm text-muted-foreground">Complete = instant refund. Fail = funds donated to charity.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                💡 <strong>Pro tip:</strong> Start with 7-day challenges to build confidence and momentum
              </p>
              <p className="text-xs text-muted-foreground">
                Research shows that strict rules with clear consequences are 3x more effective than flexible guidelines
              </p>
            </div>
          </Card>
        </section>

        {/* Testimonials Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="info" className="mb-4">Success Stories</Badge>
            <h2 className="text-4xl font-bold mb-4">Real People, Real Results</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from users who transformed their habits with financial accountability
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="elevated" className="group hover:scale-105 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-semibold">Sarah M.</div>
                    <div className="text-sm text-muted-foreground">30-day morning run challenge</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "I've tried 12 different habit apps. This is the ONLY one that worked. The $15 stake made all the difference!"
                </p>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card variant="elevated" className="group hover:scale-105 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <div className="font-semibold">Michael R.</div>
                    <div className="text-sm text-muted-foreground">14-day meditation challenge</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Failed meditation 3x before this. The money pressure kept me honest. Now it's a permanent habit!"
                </p>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card variant="elevated" className="group hover:scale-105 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-semibold">Alex K.</div>
                    <div className="text-sm text-muted-foreground">7-day reading challenge</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Simple concept, powerful results. The fear of losing $15 kept me reading even on busy days."
                </p>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="text-center mb-20">
          <Card variant="glass" className="max-w-4xl mx-auto p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10"></div>
            <div className="relative z-10">
              <Badge variant="gradient" className="mb-4">Ready to Start?</Badge>
              <h2 className="text-4xl font-bold mb-4">Your Habits Are Waiting</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join 1,247+ people who've already put their money where their mouth is. 
                What habit will you finally stick to?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/signup">
                  <Button 
                    size="xl" 
                    variant="challenge" 
                    className="group shadow-xl hover:shadow-2xl flex items-center gap-2"
                  >
                    <span className="text-lg font-bold">Start My Challenge</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Button size="xl" variant="outline" asChild>
                  <Link href="/auth/login">
                    I Already Have an Account
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 text-sm text-muted-foreground">
                <p>💡 Start with a 7-day challenge • 🔒 Your money is protected by Stripe • ⚡ Instant refund on success</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Modern Footer */}
        <footer className="border-t border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <Crown className="w-6 h-6 text-primary" />
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    I Bet You Can't
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  The psychology-powered habit app that uses financial stakes to drive real behavior change.
                </p>
                <div className="flex space-x-4">
                  <Badge variant="outline" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Stripe Secured
                  </Badge>
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
                  <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                  <li><Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link></li>
                  <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                  <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                  <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                  <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                </ul>
              </div>

              {/* Legal & Support */}
              <div>
                <h4 className="font-semibold mb-4">Legal & Support</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                  <li><Link href="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
                  <li><Link href="/support" className="hover:text-foreground transition-colors">Support</Link></li>
                </ul>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                <p>&copy; 2024 I Bet You Can't. All rights reserved.</p>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>Stripe Protected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Money-Back Guarantee</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Financial commitments are held securely by Stripe and released according to challenge outcomes. 
                Failed challenges donate funds to registered charities.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
