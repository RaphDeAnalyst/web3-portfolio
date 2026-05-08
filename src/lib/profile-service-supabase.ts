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