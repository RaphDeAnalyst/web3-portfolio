'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Smartphone, Monitor, AppWindow } from 'lucide-react'

export default function AdminTestPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const testUrls = [
    {
      label: 'Home with Admin Parameter',
      url: `${window.location.origin}/?admin=true`,
      description: 'Shows admin link in mobile menu'
    },
    {
      label: 'About with Dev Parameter',
      url: `${window.location.origin}/about?dev=true`,
      description: 'Alternative parameter for admin access'
    },
    {
      label: 'Direct Admin Access',
      url: `${window.location.origin}/admin`,
      description: 'Direct link to admin panel'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Access Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Test all methods of accessing the admin panel across different devices and platforms.
          </p>
        </div>

        {/* Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Desktop Method */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Monitor className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Desktop</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <strong>Direct URL:</strong> Navigate to /admin
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <strong>URL Parameter:</strong> Add ?admin=true to any page
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <strong>Keyboard:</strong> Ctrl/Cmd + Shift + A (if configured)
              </div>
            </div>
          </div>

          {/* Mobile Method */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Smartphone className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mobile</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <strong>5-Tap Gesture:</strong> Tap logo 5 times quickly
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <strong>URL Parameter:</strong> Shows admin link in mobile menu
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <strong>Direct URL:</strong> Navigate to /admin in mobile browser
              </div>
            </div>
          </div>

          {/* PWA Method */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <AppWindow className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">PWA</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <strong>App Shortcut:</strong> Long press app icon → Admin Panel
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <strong>In-App:</strong> Use mobile methods within PWA
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <strong>Chrome Menu:</strong> Three dots → App shortcuts
              </div>
            </div>
          </div>
        </div>

        {/* Test URLs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Test URLs</h2>
          <div className="space-y-4">
            {testUrls.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{item.label}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded mt-2 inline-block">
                    {item.url}
                  </code>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => copyToClipboard(item.url, item.label)}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <Link
                    href={item.url}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Test
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Gesture Test */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 shadow-lg border border-red-200 dark:border-red-800 mt-8">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4">
            🔥 Mobile Gesture Test
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-4">
            On mobile devices, tap the logo in the navbar 5 times quickly (within 3 seconds) to access the admin panel.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>You'll see a counter appear</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Haptic feedback on success</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Auto-redirect to /admin</span>
            </div>
          </div>
        </div>

        {/* Status */}
        {copied && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            Copied {copied} URL!
          </div>
        )}
      </div>
    </div>
  )
}