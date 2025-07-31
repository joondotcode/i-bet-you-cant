'use client'

import { useState, useEffect } from 'react'

export function SocialProof() {
  const [stats] = useState({
    activeUsers: 2847,
    completedChallenges: 12456,
    totalStaked: 187050
  })

  const testimonials = [
    {
      name: "Sarah Chen",
      challenge: "Daily meditation",
      duration: "14 days",
      quote: "The $15 stake made all the difference. I actually meditated every single day!",
      verified: true
    },
    {
      name: "Marcus Johnson", 
      challenge: "Morning workout",
      duration: "30 days",
      quote: "Best investment I ever made. Lost 12 pounds and built a habit that stuck.",
      verified: true
    },
    {
      name: "Emily Rodriguez",
      challenge: "Read 30 min daily",
      duration: "21 days", 
      quote: "The fear of losing $15 kept me reading even on my busiest days.",
      verified: true
    }
  ]

  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <div className="flex -space-x-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white dark:border-gray-800" />
            ))}
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold">
              +
            </div>
          </div>
          <span><strong>{stats.activeUsers.toLocaleString()}+</strong> users committed</span>
        </div>
        
        <div className="text-gray-600 dark:text-gray-400">
          <span><strong>{stats.completedChallenges.toLocaleString()}+</strong> challenges completed</span>
        </div>
        
        <div className="text-gray-600 dark:text-gray-400">
          <span><strong>${stats.totalStaked.toLocaleString()}+</strong> in stakes returned to winners</span>
        </div>
      </div>

      {/* Testimonial Carousel */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            "{testimonials[currentTestimonial].quote}"
          </blockquote>
          
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{testimonials[currentTestimonial].name}</span>
                {testimonials[currentTestimonial].verified && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {testimonials[currentTestimonial].challenge} • {testimonials[currentTestimonial].duration}
              </div>
            </div>
          </div>
        </div>
        
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentTestimonial(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentTestimonial ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}