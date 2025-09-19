import { supabase, type Profile as SupabaseProfile } from './supabase'
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

export class ProfileServiceSupabase {
  // Default profile data
  private static defaultProfile: ProfileData = {
    name: 'Matthew Raphael',
    title: 'Web3 Data & AI Specialist',
    bio: 'Transitioning from traditional data analytics to blockchain insights and Web3 analytics. Known as RaphdeAnalyst, I am passionate about decentralized data and AI-powered blockchain analysis, building the future of Web3 analytics.',
    avatar: '/avatar.jpg',
    email: 'matthewraphael@matthewraphael.xyz',
    location: 'Remote',
    dune: 'raphdeanalyst',
    github: 'RaphdeAnalyst',
    twitter: 'RaphdeAnalyst',
    linkedin: 'matthewraphael',
    skills: ['Python', 'SQL', 'Dune Analytics', 'Web3', 'Data Analysis', 'Machine Learning', 'Blockchain Analysis', 'DeFi', 'Smart Contracts'],
    resume: '',
    story: `I'm a data analyst transitioning from Web2 to Web3, with strong foundations in Python, SQL, and statistical modeling. I began my analytics journey in 2022, building skills in data querying, visualization, and predictive analytics. By 2023, I had advanced into statistical modeling, regression analysis, and machine learning applications, applying analytics to solve real-world problems in traditional finance.

In 2024, I became fascinated by blockchain's open datasets and began studying DeFi protocols, smart contracts, and tokenomics. This curiosity led me to start hands-on Web3 analytics projects in 2025. For example, I built an Ethereum gas price dashboard that identified 20% cost savings opportunities, and created 8 Dune Analytics dashboards tracking over $100M in DeFi volumes.

Today, I work with Dune Analytics and Flipside Crypto to analyze wallet behavior, DeFi activity, and NFT markets, while also learning Solidity basics to deepen my understanding of blockchain data structures. My goal is to establish myself as a Web3 Data & AI Specialist, bridging the rigor of traditional analytics with the transparency and innovation of blockchain data.`
  }

  // Transform Supabase Profile to ProfileData
  private static transformToProfileData(profile: SupabaseProfile): ProfileData {
    return {
      name: profile.name,
      title: 'Web3 Data & AI Specialist', // Static for now
      bio: profile.bio,
      avatar: profile.avatar_url || '/avatar.jpg',
      email: profile.contact_email || '',
      location: 'Remote', // Static for now
      dune: this.defaultProfile.dune, // Use default until schema is updated
      github: profile.github_url ? profile.github_url.replace('https://github.com/', '') : '',
      twitter: profile.twitter_url ? profile.twitter_url.replace('https://twitter.com/', '') : '',
      linkedin: profile.linkedin_url ? profile.linkedin_url.replace('https://linkedin.com/in/', '') : '',
      skills: profile.skills || [],
      resume: profile.resume_url || '',
      story: profile.story || this.defaultProfile.story
    }
  }

  // Transform ProfileData to Supabase Profile format
  private static transformToSupabaseProfile(profileData: ProfileData): Partial<SupabaseProfile> {
    return {
      name: profileData.name,
      bio: profileData.bio,
      skills: profileData.skills,
      tools: this.defaultProfile.skills, // Use skills as tools for now
      values: ['Transparency', 'Decentralization', 'Innovation'], // Default values
      contact_email: profileData.email,
      github_url: profileData.github ? `https://github.com/${profileData.github}` : undefined,
      linkedin_url: profileData.linkedin ? `https://linkedin.com/in/${profileData.linkedin}` : undefined,
      twitter_url: profileData.twitter ? `https://twitter.com/${profileData.twitter}` : undefined,
      avatar_url: profileData.avatar !== '/avatar.jpg' ? profileData.avatar : undefined,
      resume_url: profileData.resume || undefined,
      story: profileData.story || undefined
    }
  }

  // Get profile data
  static async getProfile(): Promise<ProfileData> {
    logger.info('🔍 Attempting to fetch profile from Supabase...')
    try {
      // Try to get profile from Supabase first
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single()

      logger.info('📊 Supabase response:', { data, error })

      if (error) {
        if (error.code === 'PGRST116') {
          logger.info('⚠️ No profile exists, creating default one...')
          // No profile exists, create default one
          const profileToInsert = this.transformToSupabaseProfile(this.defaultProfile)
          logger.info('📝 Profile to insert:', profileToInsert)
          
          const { data: newProfile, error: insertError } = await supabase
            .from('profile')
            .insert([profileToInsert])
            .select()
            .single()

          if (insertError) {
            logger.error('❌ Error creating default profile:', insertError)
            logger.info('🔙 Falling back to default profile')
            return this.defaultProfile
          }

          logger.info('✅ Successfully created profile:', newProfile)
          return this.transformToProfileData(newProfile)
        }
        
        logger.error('❌ Error fetching profile from Supabase:', error)
        logger.info('🔙 Falling back to default profile')
        return this.defaultProfile
      }

      logger.info('✅ Successfully fetched profile from Supabase')
      return this.transformToProfileData(data)
    } catch (error) {
      logger.error('💥 Exception in getProfile:', error)
      logger.info('🔙 Falling back to default profile')
      return this.defaultProfile
    }
  }

  // Save profile data
  static async saveProfile(profileData: ProfileData): Promise<void> {
    try {
      const supabaseProfile = this.transformToSupabaseProfile(profileData)

      // Check if profile exists
      const { data: existing } = await supabase
        .from('profile')
        .select('id')
        .single()

      if (existing) {
        // Update existing profile
        const { error } = await supabase
          .from('profile')
          .update(supabaseProfile)
          .eq('id', existing.id)

        if (error) {
          logger.error('Error updating profile:', error)
          throw new Error('Failed to save profile data')
        }
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('profile')
          .insert([supabaseProfile])

        if (error) {
          logger.error('Error inserting profile:', error)
          throw new Error('Failed to save profile data')
        }
      }

      logger.info('Profile saved successfully')
    } catch (error) {
      logger.error('Error in saveProfile:', error)
      throw new Error('Failed to save profile data')
    }
  }

  // Update specific profile field
  static async updateProfileField<K extends keyof ProfileData>(
    field: K, 
    value: ProfileData[K]
  ): Promise<void> {
    try {
      const profile = await this.getProfile()
      profile[field] = value
      await this.saveProfile(profile)
    } catch (error) {
      logger.error('Error updating profile field:', error)
      throw error
    }
  }

  // Get social links with full URLs
  static async getSocialLinks(): Promise<Array<{
    name: string
    url: string
    icon: string
    username: string
  }>> {
    try {
      const profile = await this.getProfile()
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
    } catch (error) {
      logger.error('Error getting social links:', error)
      return []
    }
  }

  // Get author info for blog posts
  static async getAuthorInfo(): Promise<{
    name: string
    avatar: string
  }> {
    try {
      const profile = await this.getProfile()
      return {
        name: profile.name,
        avatar: profile.avatar
      }
    } catch (error) {
      logger.error('Error getting author info:', error)
      return {
        name: this.defaultProfile.name,
        avatar: this.defaultProfile.avatar
      }
    }
  }

  // Initialize profile with default data if empty
  static async initializeProfile(): Promise<void> {
    try {
      const existing = await this.getProfile()
      // This will create default profile if none exists
      logger.info('Profile initialized', { name: existing.name })
    } catch (error) {
      logger.error('Error initializing profile:', error)
    }
  }

  // Export profile data
  static async exportProfile(): Promise<string> {
    try {
      const profile = await this.getProfile()
      return JSON.stringify(profile, null, 2)
    } catch (error) {
      logger.error('Error exporting profile:', error)
      return JSON.stringify(this.defaultProfile, null, 2)
    }
  }

  // Import profile data
  static async importProfile(profileJson: string): Promise<void> {
    try {
      const profileData = JSON.parse(profileJson) as ProfileData
      // Validate the data has required fields
      if (!profileData.name || !profileData.title) {
        throw new Error('Invalid profile data')
      }
      await this.saveProfile({ ...this.defaultProfile, ...profileData })
    } catch (error) {
      logger.error('Error importing profile:', error)
      throw new Error('Failed to import profile data')
    }
  }

  // Get profile from localStorage and migrate to Supabase
  static async migrateFromLocalStorage(): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('portfolio-profile')
      if (stored) {
        const localProfile = JSON.parse(stored) as ProfileData
        logger.info('Migrating profile from localStorage to Supabase...')
        await this.saveProfile(localProfile)
        logger.info('Profile migration completed')
      }
    } catch (error) {
      logger.error('Error migrating profile from localStorage:', error)
    }
  }
}

export const profileServiceSupabase = ProfileServiceSupabase