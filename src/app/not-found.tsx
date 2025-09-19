'use client'

import Link from 'next/link'
import { HomeIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-secondary dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Main Content */}
        <div className="space-y-6">
          {/* Friendly Message */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              Oops, you found this page!
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed">
              You think you&apos;re lost? Don&apos;t worry, it happens to the best of us.
            </p>
          </div>

          {/* Illustration/Icon */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500/20 to-cyber-500/20 flex items-center justify-center backdrop-blur-sm border border-primary-500/20">
              <div className="text-6xl">🧭</div>
            </div>
          </div>

          {/* Home Button */}
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-cyber-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-background"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Take me home</span>
            </Link>
          </div>

          {/* Additional Help */}
          <div className="pt-6 space-y-3 text-sm text-foreground/60">
            <p>Or try these popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/portfolio"
                className="text-primary-500 hover:text-primary-600 hover:underline transition-colors duration-200"
              >
                Portfolio
              </Link>
              <Link
                href="/blog"
                className="text-primary-500 hover:text-primary-600 hover:underline transition-colors duration-200"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="text-primary-500 hover:text-primary-600 hover:underline transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-primary-500 hover:text-primary-600 hover:underline transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary-500/10 to-cyber-500/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-cyber-500/10 to-primary-500/10 blur-3xl"></div>
        </div>
      </div>
    </div>
  )
}