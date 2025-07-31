export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-6 py-8">
      {/* SSL Badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <div className="text-left">
          <div className="text-sm font-semibold text-green-800 dark:text-green-200">SSL Secured</div>
          <div className="text-xs text-green-600 dark:text-green-400">256-bit encryption</div>
        </div>
      </div>

      {/* Stripe Badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <div className="text-left">
          <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">Stripe Protected</div>
          <div className="text-xs text-blue-600 dark:text-blue-400">PCI compliant</div>
        </div>
      </div>

      {/* Money Back Badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
        <div className="text-left">
          <div className="text-sm font-semibold text-purple-800 dark:text-purple-200">Money Back</div>
          <div className="text-xs text-purple-600 dark:text-purple-400">Success guarantee</div>
        </div>
      </div>

      {/* GDPR Badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-.257-.257A6 6 0 0118 8zM2 8a6 6 0 1010.743 5.743L12 14l-.257-.257A6 6 0 012 8zm8 2a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">GDPR Compliant</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Privacy protected</div>
        </div>
      </div>
    </div>
  )
}