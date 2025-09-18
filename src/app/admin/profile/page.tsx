'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProfilePictureUpload } from '@/components/ui/profile-picture-upload'
import { profileService } from '@/lib/service-switcher'
import type { ProfileData } from '@/lib/profile-service-supabase'
import { AlertTriangle } from 'lucide-react'

export default function ProfileManagement() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await profileService.getProfile()
        setProfile(profileData)
      } catch (error) {
        console.error('Error loading profile:', error)
        setMessage({ type: 'error', text: 'Failed to load profile data.' })
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    if (!profile) return
    
    setIsLoading(true)
    try {
      await profileService.saveProfile(profile)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkillAdd = (skill: string) => {
    if (!profile || !skill.trim() || profile.skills.includes(skill.trim())) return
    
    setProfile(prev => prev ? {
      ...prev,
      skills: [...prev.skills, skill.trim()]
    } as ProfileData : null)
  }

  const handleSkillRemove = (skillToRemove: string) => {
    if (!profile) return
    
    setProfile(prev => prev ? {
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    } as ProfileData : null)
  }

  const handleImageUpload = (imageUrl: string) => {
    if (!profile) return
    
    setProfile(prev => prev ? {
      ...prev,
      avatar: imageUrl
    } as ProfileData : null)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse"></div>
          </div>
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 text-center py-20">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Profile Not Found</h1>
        <p className="text-foreground/70">Unable to load profile data.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-accent-blue hover:bg-accent-blue-light text-white rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-accent-blue/20">
          Retry
        </button>
      </div>
    )
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
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Profile Management</h1>
            <p className="text-sm sm:text-base text-foreground/70">Update your profile information and settings</p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-4 py-2 bg-accent-blue hover:bg-accent-blue-light text-white rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-accent-blue/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
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
          <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6 sticky top-24 lg:top-28 z-10">
            <h2 className="text-xl font-bold text-foreground mb-6">Profile Picture</h2>
            
            <div className="space-y-4">
              {/* Professional Profile Picture Upload */}
              <ProfilePictureUpload
                onImageSelect={handleImageUpload}
                currentImage={profile.avatar}
                size="xl"
                className="w-full"
              />
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
                  onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } as ProfileData : null)}
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
                  onChange={(e) => setProfile(prev => prev ? { ...prev, title: e.target.value } as ProfileData : null)}
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
                  onChange={(e) => setProfile(prev => prev ? { ...prev, email: e.target.value } as ProfileData : null)}
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
                  onChange={(e) => setProfile(prev => prev ? { ...prev, location: e.target.value } as ProfileData : null)}
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
                onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } as ProfileData : null)}
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
                  onChange={(e) => setProfile(prev => prev ? { ...prev, website: e.target.value } as ProfileData : null)}
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
                  onChange={(e) => setProfile(prev => prev ? { ...prev, github: e.target.value } as ProfileData : null)}
                  placeholder="RaphDeAnalyst"
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
                  onChange={(e) => setProfile(prev => prev ? { ...prev, twitter: e.target.value } as ProfileData : null)}
                  placeholder="RaphDeAnalyst"
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
                  onChange={(e) => setProfile(prev => prev ? { ...prev, linkedin: e.target.value } as ProfileData : null)}
                  placeholder="RaphDeAnalyst"
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
                onChange={(e) => setProfile(prev => prev ? { ...prev, resume: e.target.value } as ProfileData : null)}
                placeholder="https://link-to-your-resume.pdf"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <p className="text-sm text-foreground/60 mt-1">
                Upload your resume to Google Drive, Dropbox, or similar service and paste the public link here
              </p>
            </div>
          </div>

          {/* My Story */}
          <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">My Story</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Story Content
              </label>
              <textarea
                value={profile.story}
                onChange={(e) => setProfile(prev => prev ? { ...prev, story: e.target.value } as ProfileData : null)}
                rows={12}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="Tell your story... Use double line breaks to separate paragraphs."
              />
              <p className="text-sm text-foreground/60 mt-1">
                This content will appear in the "My Story" section on the About page. Use double line breaks to separate paragraphs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}