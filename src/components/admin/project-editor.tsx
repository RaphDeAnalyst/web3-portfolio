'use client'

import { useState, useEffect } from 'react'
import { activityService } from '@/lib/service-switcher'
import { Project } from '@/data/projects'

interface ProjectData extends Omit<Project, 'id'> {
  id?: string
}

interface ProjectEditorProps {
  initialData?: Partial<ProjectData>
  onSave: (data: ProjectData, isDraft: boolean) => void
}

export function ProjectEditor({ initialData, onSave }: ProjectEditorProps) {
  const [formData, setFormData] = useState<ProjectData>({
    title: '',
    description: '',
    category: 'Analytics',
    status: 'Development',
    tech: [],
    demoUrl: '',
    githubUrl: '',
    duneUrl: '',
    blogPostSlug: '',
    metrics: {},
    featured: false,
    timeline: '2025',
    phase: 'Web3 Analytics',
    image: '',
    imageAlt: '',
    ...initialData
  })

  const [techInput, setTechInput] = useState('')
  const [featureInput, setFeatureInput] = useState('')
  const [metricKey, setMetricKey] = useState('')
  const [metricValue, setMetricValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field: keyof ProjectData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTech = () => {
    if (techInput.trim() && !formData.tech.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tech: [...prev.tech, techInput.trim()]
      }))
      setTechInput('')
    }
  }

  const handleRemoveTech = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tech: prev.tech.filter(tech => tech !== techToRemove)
    }))
  }

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features?.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }))
      setFeatureInput('')
    }
  }

  const handleRemoveFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(feature => feature !== featureToRemove) || []
    }))
  }

  const handleAddMetric = () => {
    if (metricKey.trim() && metricValue.trim() && !formData.metrics[metricKey.trim()]) {
      setFormData(prev => ({
        ...prev,
        metrics: { ...prev.metrics, [metricKey.trim()]: metricValue.trim() }
      }))
      setMetricKey('')
      setMetricValue('')
    }
  }

  const handleRemoveMetric = (keyToRemove: string) => {
    setFormData(prev => {
      const newMetrics = { ...prev.metrics }
      delete newMetrics[keyToRemove]
      return { ...prev, metrics: newMetrics }
    })
  }

  const handleSave = async (isDraft: boolean) => {
    setIsSaving(true)
    
    const dataToSave = {
      ...formData,
      status: isDraft ? 'Development' : formData.status
    }

    // Track activity
    if (!isDraft) {
      await activityService.trackProject(formData.title, !!initialData?.id)
    }

    try {
      await onSave(dataToSave, isDraft)
    } catch (error) {
      console.error('Failed to save project:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const categories = [
    'Analytics',
    'Smart Contracts',
    'Dashboards',
    'AI x Web3',
    'DeFi',
    'Learning'
  ]

  const statusOptions = [
    { value: 'Live', label: 'Live', color: 'green' },
    { value: 'Development', label: 'Development', color: 'blue' },
    { value: 'Beta', label: 'Beta', color: 'yellow' },
    { value: 'Complete', label: 'Complete', color: 'purple' },
    { value: 'Learning', label: 'Learning', color: 'orange' }
  ]

  const timelineOptions = ['2022-2023', '2024', '2025']
  
  const phaseOptions = [
    'Traditional Analytics',
    'Exploratory Phase', 
    'Web3 Analytics'
  ]

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex items-center justify-between bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <div className="text-sm text-foreground/60">
          {initialData?.id ? 'Editing existing project' : 'Creating new project'}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving || !formData.title.trim()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-foreground rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            💾 Save Draft
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving || !formData.title.trim() || !formData.description.trim()}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:transform-none"
          >
            {isSaving ? '🔄 Saving...' : '🚀 Save Project'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Project Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter project name..."
              className="w-full px-4 py-3 text-xl font-bold border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your project, its goals, and what you learned..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 resize-none"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Demo URL</label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                placeholder="https://your-project-demo.com"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
              />
            </div>
          </div>

          {/* Additional Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Dune Dashboard URL</label>
              <input
                type="url"
                value={formData.duneUrl || ''}
                onChange={(e) => handleInputChange('duneUrl', e.target.value)}
                placeholder="https://dune.com/username/dashboard"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Related Blog Post Slug</label>
              <input
                type="text"
                value={formData.blogPostSlug || ''}
                onChange={(e) => handleInputChange('blogPostSlug', e.target.value)}
                placeholder="my-project-analysis"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Tech Stack</label>
            <div className="flex">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                placeholder="Add technology..."
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-l-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
              />
              <button
                onClick={handleAddTech}
                className="px-3 py-2 bg-cyber-500 text-white rounded-r-lg hover:bg-cyber-600 transition-colors"
              >
                +
              </button>
            </div>
            
            {formData.tech.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tech.map(tech => (
                  <span
                    key={tech}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-cyber-500/10 text-cyber-500 text-sm rounded-full"
                  >
                    <span>{tech}</span>
                    <button
                      onClick={() => handleRemoveTech(tech)}
                      className="text-cyber-500/70 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Project Metrics */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Project Metrics</label>
            <p className="text-xs text-foreground/60">Add key metrics that highlight your project's impact and results</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={metricKey}
                onChange={(e) => setMetricKey(e.target.value)}
                placeholder="Metric name (e.g., 'accuracy')"
                className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
              />
              <div className="flex">
                <input
                  type="text"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMetric())}
                  placeholder="Value (e.g., '85%')"
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-l-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                />
                <button
                  onClick={handleAddMetric}
                  className="px-3 py-2 bg-green-500 text-white rounded-r-lg hover:bg-green-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            
            {Object.keys(formData.metrics).length > 0 && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {Object.entries(formData.metrics).map(([key, value]) => (
                  <div key={key} className="text-center space-y-1 relative">
                    <button
                      onClick={() => handleRemoveMetric(key)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                    <div className="text-green-500 font-bold text-lg">{value}</div>
                    <div className="text-xs text-foreground/60 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-xs text-foreground/50 space-y-1">
              <p><strong>Examples:</strong></p>
              <p>• accuracy: "85%" • datapoints: "10K+" • users: "500+"</p>
              <p>• timeframe: "6 months" • savings: "20%" • protocols: "12"</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Key Features</label>
            <div className="flex">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                placeholder="Add a feature..."
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-l-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
              />
              <button
                onClick={handleAddFeature}
                className="px-3 py-2 bg-primary-500 text-white rounded-r-lg hover:bg-primary-600 transition-colors"
              >
                +
              </button>
            </div>
            
            {formData.features && formData.features.length > 0 && (
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-foreground">• {feature}</span>
                    <button
                      onClick={() => handleRemoveFeature(feature)}
                      className="text-foreground/60 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Challenges</label>
              <textarea
                value={formData.challenges}
                onChange={(e) => handleInputChange('challenges', e.target.value)}
                placeholder="What challenges did you face and how did you overcome them?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-background text-foreground focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Key Learnings</label>
              <textarea
                value={formData.learnings}
                onChange={(e) => handleInputChange('learnings', e.target.value)}
                placeholder="What did you learn from this project?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-background text-foreground focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Project Status</h3>
            <div className="space-y-3">
              {statusOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={formData.status === option.value}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="text-cyber-500 focus:ring-cyber-500"
                  />
                  <span className="text-sm text-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </div>


          {/* Category & Priority */}
          <div className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Classification</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Timeline</label>
                <select
                  value={formData.timeline || '2025'}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                >
                  {timelineOptions.map(timeline => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phase</label>
                <select
                  value={formData.phase || 'Web3 Analytics'}
                  onChange={(e) => handleInputChange('phase', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                >
                  {phaseOptions.map(phase => (
                    <option key={phase} value={phase}>{phase}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Featured Project */}
          <div className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Featured Project</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="w-4 h-4 text-cyber-500 bg-gray-100 border-gray-300 rounded focus:ring-cyber-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Mark as featured</div>
                  <div className="text-xs text-foreground/60">Featured projects appear at the top of the portfolio page (max 2)</div>
                </div>
              </label>
              
              {formData.featured && (
                <div className="p-3 bg-gradient-to-r from-primary-500/10 to-cyber-500/10 rounded-lg border border-primary-500/20">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium text-primary-500">Featured Project</span>
                  </div>
                  <p className="text-xs text-foreground/70 mt-1">
                    This project will be highlighted prominently on the portfolio page
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Timeline</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                />
              </div>
              
              {formData.status === 'completed' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}