import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function FAQPage() {
  const faqs = [
    {
      category: "How It Works",
      questions: [
        {
          q: "How does the accountability system work?",
          a: "You commit to a daily habit for 7-30 days and stake $15. Check in every single day to keep your money. Miss even one day and you lose it all. This uses loss aversion psychology - the fear of losing money is 2x more powerful than the prospect of gaining it."
        },
        {
          q: "What happens to my money?",
          a: "Your $15 is held securely by Stripe in escrow. If you complete every day of your challenge, it's automatically returned to your original payment method. If you miss any day, it's permanently forfeited and used to maintain the platform."
        },
        {
          q: "Can I have multiple challenges at once?",
          a: "No. You can only have one active challenge at a time. This ensures focus and prevents people from hedging their bets across multiple easier challenges."
        }
      ]
    },
    {
      category: "Rules & Policy",
      questions: [
        {
          q: "What counts as missing a day?",
          a: "Not checking in during any 24-hour calendar day (12:00 AM to 11:59 PM in your timezone) counts as a miss. There are absolutely no exceptions - being sick, traveling, having emergencies, or forgetting does not excuse a missed day."
        },
        {
          q: "Can I get extensions or exceptions?",
          a: "No. Zero tolerance means zero exceptions. We don't grant extensions for illness, emergencies, travel, technical issues, or any other reason. This strict policy is what makes the system effective."
        },
        {
          q: "What if I check in but didn't actually do the habit?",
          a: "The system relies on your honesty. You're essentially making a commitment to yourself. Lying defeats the purpose and only cheats yourself out of building a real habit."
        },
        {
          q: "Can I get a refund if I change my mind?",
          a: "No refunds after payment. Once you start a challenge, the only way to get your money back is to complete every single day. This commitment is what makes it work."
        }
      ]
    },
    {
      category: "Payment & Security",
      questions: [
        {
          q: "Is my payment information secure?",
          a: "Yes. All payments are processed by Stripe, a PCI-compliant payment processor used by millions of businesses. We never see or store your card details - they're encrypted and handled entirely by Stripe."
        },
        {
          q: "When do I get my money back?",
          a: "Immediately upon completing your final day. The refund is processed automatically within minutes of your last check-in and typically appears in your account within 2-5 business days."
        },
        {
          q: "Why is the amount fixed at $15?",
          a: "Research shows $15 is the optimal amount - high enough to motivate most people but low enough to be accessible. This fixed amount prevents people from gaming the system with tiny stakes."
        }
      ]
    },
    {
      category: "Technical",
      questions: [
        {
          q: "What if the app is down when I need to check in?",
          a: "This is extremely rare, but if verified, we may grant exceptions. However, you should check in early in the day, not wait until the last minute. Technical issues are your responsibility to work around."
        },
        {
          q: "How do timezones work?",
          a: "Check-ins are based on your local timezone as set when you create the challenge. You must check in between 12:00 AM and 11:59 PM in that timezone each day."
        },
        {
          q: "Can I change my habit mid-challenge?",
          a: "No. The habit is locked when you start. You can end your current challenge (losing your money) and start a new one after the 7-day waiting period."
        }
      ]
    },
    {
      category: "Success Tips",
      questions: [
        {
          q: "What makes people successful?",
          a: "Start with 7-day challenges, choose specific and measurable habits, set daily reminders, and pick something you can do even on your worst days. Most failures happen because people choose overly ambitious habits."
        },
        {
          q: "Should I start with a 30-day challenge?",
          a: "No! Start with 7 days. Our data shows 78% success rate for 7-day vs 41% for 30-day challenges. Build confidence with shorter challenges first."
        },
        {
          q: "What are the most successful habit types?",
          a: "Simple habits with clear completion criteria work best: '10 minutes meditation,' 'write 200 words,' 'no social media,' '30-minute walk.' Avoid vague habits like 'eat healthy' or 'be productive.'"
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-foreground mt-4 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about how I Bet You Can&apos;t works, our policies, and tips for success.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <Card key={sectionIndex} variant="elevated">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">{section.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still Have Questions */}
        <Card variant="outlined" className="mt-12 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-blue-800 dark:text-blue-200 mb-6">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Contact Support
              </Link>
              <Link 
                href="/auth/signup" 
                className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Start Your Challenge
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}