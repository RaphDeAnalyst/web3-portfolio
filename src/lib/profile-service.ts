import { logger } from './logger'

export interface ProfileData {
  name: string
  title: string
  bio: string
  avatar: string
  email: string
  location: string
  dune: string
  github: string
  twitter: string
  linkedin: string
  skills: string[]
  resume: string
  story: string
}

export class ProfileService {
  private static readonly STORAGE_KEY = 'portfolio-profile'

  // Default profile data
  private static defaultProfile: ProfileData = {
    name: 'Matthew Raphael Nnamani',
    title: 'Blockchain Intelligence Practitioner',
    bio: 'Blockchain intelligence analyst conducting AML-aligned on-chain investigations, wallet behavioral profiling, and KYT/transaction monitoring across EVM chains since 2024.',
    avatar: '/avatar.jpg',
    email: 'matthewraphael@matthewraphael.xyz',
    location: 'Lagos, Nigeria',
    dune: 'notes0x',
    github: 'notes0x',
    twitter: '0x_note',
    linkedin: 'matthew-nnamani',
    skills: ['On-Chain Investigation', 'KYT / Transaction Monitoring', 'Multi-Hop Fund Tracing', 'AML/CTF Compliance', 'OFAC Sanctions Screening', 'Trino SQL', 'Dune Analytics', 'Python'],
    resume: '',
    story: `Blockchain intelligence analyst conducting AML-aligned on-chain investigations, wallet behavioral profiling, and KYT/transaction monitoring across EVM chains since 2024. Work spans multi-hop fund tracing, USDT flow attribution, cross-chain bridge analysis, sanctions screening, and structured compliance reporting — applying FATF, OFAC, and FinCEN frameworks to real financial crime casework. BSc Chemistry, University of Uyo, 2023.`
  }

  // Get profile data
  static getProfile(): ProfileData {
    if (typeof window === 'undefined') {
      return this.defaultProfile
    }
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        return { ...this.defaultProfile, ...JSON.parse(stored) }
      }
      return this.defaultProfile
    } catch {
      return this.defaultProfile
    }
  }

  // Save profile data
  static saveProfile(profileData: ProfileData): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profileData))
    } catch (error) {
      logger.error('Failed to save profile:', error)
      throw new Error('Failed to save profile data')
    }
  }

  // Update specific profile field
  static updateProfileField<K extends keyof ProfileData>(
    field: K, 
    value: ProfileData[K]
  ): void {
    const profile = this.getProfile()
    profile[field] = value
    this.saveProfile(profile)
  }

  // Get social links with full URLs
  static getSocialLinks(): Array<{
    name: string
    url: string
    icon: string
    username: string
  }> {
    const profile = this.getProfile()
    const links = []

    if (profile.github) {
      links.push({
        name: 'GitHub',
        url: `https://github.com/${profile.github}`,
        icon: '🐙',
        username: profile.github
      })
    }

    if (profile.twitter) {
      links.push({
        name: 'Twitter',
        url: `https://twitter.com/${profile.twitter}`,
        icon: '𝕏',
        username: `@${profile.twitter}`
      })
    }

    if (profile.linkedin) {
      links.push({
        name: 'LinkedIn',
        url: `https://linkedin.com/in/${profile.linkedin}`,
        icon: '💼',
        username: profile.linkedin
      })
    }

    if (profile.dune) {
      links.push({
        name: 'Dune',
        url: `https://dune.com/${profile.dune}`,
        icon: '📊',
        username: profile.dune
      })
    }

    return links
  }

  // Get author info for blog posts
  static getAuthorInfo(): {
    name: string
    avatar: string
  } {
    const profile = this.getProfile()
    return {
      name: profile.name,
      avatar: profile.avatar
    }
  }

  // Initialize profile with default data if empty
  static initializeProfile(): void {
    const existing = this.getProfile()
    if (JSON.stringify(existing) === JSON.stringify(this.defaultProfile)) {
      // Profile hasn't been customized yet, just ensure it's saved
      this.saveProfile(existing)
    }
  }

  // Force refresh profile data (useful for clearing old cached data)
  static refreshProfile(): void {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const parsedStored = JSON.parse(stored)
        // If stored profile has old "Data Analyst" name, update it
        if (parsedStored.name === 'Data Analyst') {
          parsedStored.name = 'Matthew Raphael'
          parsedStored.bio = this.defaultProfile.bio
          parsedStored.email = this.defaultProfile.email
          parsedStored.skills = this.defaultProfile.skills
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsedStored))
          
          // Trigger a profile update event
          window.dispatchEvent(new CustomEvent('profileUpdated'))
        }
      }
    } catch (error) {
      logger.error('Error refreshing profile:', error)
    }
  }

  // Export profile data
  static exportProfile(): string {
    return JSON.stringify(this.getProfile(), null, 2)
  }

  // Import profile data
  static importProfile(profileJson: string): void {
    try {
      const profileData = JSON.parse(profileJson) as ProfileData
      // Validate the data has required fields
      if (!profileData.name || !profileData.title) {
        throw new Error('Invalid profile data')
      }
      this.saveProfile({ ...this.defaultProfile, ...profileData })
    } catch (error) {
      throw new Error('Failed to import profile data')
    }
  }
}