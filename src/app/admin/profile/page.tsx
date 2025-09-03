'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ImageUpload } from '@/components/ui/image-upload'

interface ProfileData {
  name: string
  title: string
  bio: string
  avatar: string
  email: string
  location: string
  website: string
  github: string
  twitter: string
  linkedin: string
  skills: string[]
  resume: string
}

export default function ProfileManagement() {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Data Analyst',
    title: 'Web3 Data & AI Specialist',
    bio: 'Transitioning from traditional data analytics to blockchain insights and Web3 analytics. Passionate about decentralized data and AI-powered blockchain analysis.',
    avatar: '/avatar.jpg',
    email: 'your.email@example.com',
    location: 'Remote',
    website: '',
    github: '',
    twitter: '',
    linkedin: '',
    skills: ['Python', 'SQL', 'Dune Analytics', 'Web3', 'Data Analysis', 'Machine Learning'],
    resume: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    // Load existing profile data from localStorage
    const savedProfile = localStorage.getItem('portfolio-profile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  const handleSave = () => {
    setIsLoading(true)
    try {
      localStorage.setItem('portfolio-profile', JSON.stringify(profile))
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkillAdd = (skill: string) => {
    if (skill.trim() && !profile.skills.includes(skill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }))
    }
  }

  const handleSkillRemove = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleImageUpload = (imageUrl: string) => {
    setProfile(prev => ({
      ...prev,
      avatar: imageUrl
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="p-2 text-foreground/60 hover:text-foreground rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ←
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Management</h1>
            <p className="text-foreground/70">Update your profile information and settings</p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
            : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Profile Picture</h2>
            
            <div className="space-y-4">
              {/* Current Avatar */}
              <div className="flex justify-center">
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                />
              </div>

              {/* Image Upload */}
              <ImageUpload
                onImageSelect={handleImageUpload}
                currentImage={profile.avatar}
                className="w-full"
              />

              <p className="text-sm text-foreground/60 text-center">
                Upload a new profile picture. Recommended: 400x400px, under 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="Tell people about yourself..."
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Social Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  GitHub
                </label>
                <input
                  type="text"
                  value={profile.github}
                  onChange={(e) => setProfile(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="username"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Twitter/X
                </label>
                <input
                  type="text"
                  value={profile.twitter}
                  onChange={(e) => setProfile(prev => ({ ...prev, twitter: e.target.value }))}
                  placeholder="username"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  LinkedIn
                </label>
                <input
                  type="text"
                  value={profile.linkedin}
                  onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="username"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Skills</h2>
            
            <div className="space-y-4">
              {/* Current Skills */}
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  >
                    {skill}
                    <button
                      onClick={() => handleSkillRemove(skill)}
                      className="ml-2 text-primary-500 hover:text-primary-700 dark:hover:text-primary-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Skill */}
              <div>
                <input
                  type="text"
                  placeholder="Add a skill and press Enter"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSkillAdd(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <p className="text-sm text-foreground/60 mt-1">
                  Type a skill and press Enter to add it
                </p>
              </div>
            </div>
          </div>

          {/* Resume */}
          <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Resume</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Resume URL
              </label>
              <input
                type="url"
                value={profile.resume}
                onChange={(e) => setProfile(prev => ({ ...prev, resume: e.target.value }))}
                placeholder="https://link-to-your-resume.pdf"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <p className="text-sm text-foreground/60 mt-1">
                Upload your resume to Google Drive, Dropbox, or similar service and paste the public link here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}