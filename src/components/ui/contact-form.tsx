'use client'

import { useState } from 'react'
import { useNotification } from '@/lib/notification-context'
import { logger } from '@/lib/logger'

interface FormData {
  name: string
  email: string
  company?: string
  projectType: string
  budget: string
  timeline: string
  message: string
}

export function ContactForm() {
  const { error, success } = useNotification()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    projectType: 'data-analysis',
    budget: 'learning',
    timeline: '1-3-months',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    else if (formData.message.length < 20) newErrors.message = 'Message must be at least 20 characters'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/mkgvpjra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company || 'Not specified',
          projectType: formData.projectType,
          budget: formData.budget,
          timeline: formData.timeline,
          message: formData.message,
          _subject: `New contact from ${formData.name} - ${formData.projectType}`,
        }),
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        success('Message sent successfully! I\'ll get back to you within 24 hours.')
      } else {
        throw new Error('Failed to send message')
      }
    } catch (err) {
      logger.error('Error submitting form:', err)
      error('Failed to send message. Please try again or contact me directly at matthewraphael@matthewraphael.xyz')
    } finally {
      setIsSubmitting(false)
    }
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        company: '',
        projectType: 'data-analysis',
        budget: 'learning',
        timeline: '1-3-months',
        message: ''
      })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const projectTypes = [
    { value: 'data-analysis', label: 'Data Analysis' },
    { value: 'dune-dashboard', label: 'Dune Dashboard' },
    { value: 'learning-collab', label: 'Learning Collaboration' },
    { value: 'research', label: 'Research Project' },
    { value: 'defi-analysis', label: 'DeFi Analysis' },
    { value: 'statistical-study', label: 'Statistical Study' },
    { value: 'portfolio-tracking', label: 'Portfolio Tracking' },
    { value: 'other', label: 'Other' }
  ]

  const budgetRanges = [
    { value: 'learning', label: 'Learning/Free' },
    { value: 'under-1k', label: 'Under $1k' },
    { value: '1k-5k', label: '$1k - $5k' },
    { value: '5k-10k', label: '$5k - $10k' },
    { value: '10k-plus', label: '$10k+' },
    { value: 'discuss', label: 'Let\'s discuss' }
  ]

  const timeframes = [
    { value: 'urgent', label: 'ASAP (Rush job)' },
    { value: '1-month', label: '1 month' },
    { value: '1-3-months', label: '1-3 months' },
    { value: '3-6-months', label: '3-6 months' },
    { value: '6-plus-months', label: '6+ months' },
    { value: 'flexible', label: 'Flexible' }
  ]

  if (isSubmitted) {
    return (
      <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-primary-600/10 to-primary-400/10 border border-primary-600/20">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl">
          ✓
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">Message Sent Successfully!</h3>
        <p className="text-foreground/70 mb-6">
          Thanks for reaching out! I'll get back to you within 24 hours to discuss your project.
        </p>
        <div className="text-sm text-foreground/60">
          Expect a response from: matthewraphael@matthewraphael.xyz
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.name ? 'border-primary-800' : 'border-border'
            } bg-card text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 relative z-10 min-h-[48px]`}
            placeholder="Your full name"
            disabled={isSubmitting}
          />
          {errors.name && <p className="mt-1 text-sm text-primary-800">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email ? 'border-primary-800' : 'border-border'
            } bg-card text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 relative z-10 min-h-[48px]`}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
          {errors.email && <p className="mt-1 text-sm text-primary-800">{errors.email}</p>}
        </div>
      </div>

      {/* Company (Optional) */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
          Company / Organization
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 relative z-10 min-h-[48px]"
          placeholder="Company (optional)"
          disabled={isSubmitting}
        />
      </div>

      {/* Project Type */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-4">
          Project Type *
        </label>

        {/* Mobile Dropdown */}
        <div className="block md:hidden">
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 relative z-10 min-h-[48px]"
            disabled={isSubmitting}
          >
            {projectTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Radio Buttons */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-3">
          {projectTypes.map((type) => (
            <label
              key={type.value}
              className={`relative cursor-pointer p-4 rounded-lg border transition-all duration-200 min-h-[48px] flex items-center justify-center ${
                formData.projectType === type.value
                  ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                  : 'border-border hover:border-border-hover'
              }`}
            >
              <input
                type="radio"
                name="projectType"
                value={type.value}
                checked={formData.projectType === type.value}
                onChange={handleChange}
                className="sr-only"
                disabled={isSubmitting}
              />
              <div className="text-center">
                <div className="text-xs font-medium">{type.label}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Budget and Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
            Budget Range
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 relative z-10 min-h-[48px]"
            disabled={isSubmitting}
          >
            {budgetRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-foreground mb-2">
            Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 relative z-10 min-h-[48px]"
            disabled={isSubmitting}
          >
            {timeframes.map((time) => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Project Details *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.message ? 'border-primary-800' : 'border-border'
          } bg-card text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 resize-none relative z-10 min-h-[120px]`}
          placeholder="Tell me about your project..."
          disabled={isSubmitting}
        />
        {errors.message && <p className="mt-1 text-sm text-primary-800">{errors.message}</p>}
        <p className="mt-2 text-xs text-foreground/60">
          Minimum 20 characters. The more details you provide, the better I can help!
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full min-h-[48px] px-6 sm:px-8 py-3 sm:py-4 rounded-storj font-semibold text-base sm:text-lg transition-all duration-200 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-storj-navy text-white hover:bg-storj-blue hover:transform hover:translate-y-[-1px] shadow-lg shadow-storj-navy/30 transition-all duration-200'
        }`}
      >
        {isSubmitting && (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-3"></div>
        )}
        {isSubmitting ? 'Sending Message...' : 'Send Message'}
      </button>

      {/* Privacy Note */}
      <p className="text-xs text-foreground/50 text-center">
        Your information is secure and will never be shared. I typically respond within 24 hours.
      </p>
    </form>
  )
}