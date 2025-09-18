import { logger } from './logger'

export interface ProfileData {
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
  story: string
}

export class ProfileService {
  private static readonly STORAGE_KEY = 'portfolio-profile'

  // Default profile data
  private static defaultProfile: ProfileData = {
    name: 'Matthew Raphael',
    title: 'Web3 Data & AI Specialist',
    bio: 'Transitioning from traditional data analytics to blockchain insights and Web3 analytics. Known as RaphdeAnalyst, I am passionate about decentralized data and AI-powered blockchain analysis, building the future of Web3 analytics.',
    avatar: '/avatar.jpg',
    email: 'matthewraphael@matthewraphael.xyz',
    location: 'Remote',
    website: '',
    github: '',
    twitter: '',
    linkedin: '',
    skills: ['Python', 'SQL', 'Dune Analytics', 'Web3', 'Data Analysis', 'Machine Learning', 'Blockchain Analysis', 'DeFi', 'Smart Contracts'],
    resume: '',
    story: `I'm a data analyst transitioning from Web2 to Web3, with strong foundations in Python, SQL, and statistical modeling. I began my analytics journey in 2022, building skills in data querying, visualization, and predictive analytics. By 2023, I had advanced into statistical modeling, regression analysis, and machine learning applications, applying analytics to solve real-world problems in traditional finance.

In 2024, I became fascinated by blockchain's open datasets and began studying DeFi protocols, smart contracts, and tokenomics. This curiosity led me to start hands-on Web3 analytics projects in 2025. For example, I built an Ethereum gas price dashboard that identified 20% cost savings opportunities, and created 8 Dune Analytics dashboards tracking over $100M in DeFi volumes.

Today, I work with Dune Analytics and Flipside Crypto to analyze wallet behavior, DeFi activity, and NFT markets, while also learning Solidity basics to deepen my understanding of blockchain data structures. My goal is to establish myself as a Web3 Data & AI Specialist, bridging the rigor of traditional analytics with the transparency and innovation of blockchain data.`
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

    if (profile.website) {
      links.push({
        name: 'Website',
        url: profile.website,
        icon: '🌐',
        username: profile.website.replace(/^https?:\/\//, '')
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