'use client'

import Link from 'next/link'
import { memo } from 'react'

const SkillsSection = memo(function SkillsSection() {
  const skillCategories = [
    {
      title: "Core Data Analytics",
      description: "Foundation skills from traditional analytics",
      skills: ["Python", "SQL", "Pandas", "Excel", "PowerBI", "Statistical Analysis"],
      color: "storj-blue"
    },
    {
      title: "Web3 Analytics",
      description: "Specialized blockchain and DeFi analysis tools",
      skills: ["Dune Analytics", "Flipside Crypto", "Web3.py", "Etherscan API", "DeFi Protocols"],
      color: "storj-navy"
    },
    {
      title: "Visualization & Tools",
      description: "Creating compelling data stories and dashboards",
      skills: ["D3.js", "React", "Tableau", "Matplotlib", "Seaborn", "Git"],
      color: "gray-600"
    }
  ]

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-gray-50/30 dark:via-gray-900/20 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-storj border border-storj-blue/30 bg-storj-blue/5 mb-6">
            <span className="w-2 h-2 bg-storj-blue rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-storj-blue">Technical Arsenal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Skills & <span className="text-gradient">Expertise</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            A comprehensive toolkit built through hands-on experience in both traditional and blockchain analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="group storj-card-lg p-8">
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-semibold mb-2 transition-colors duration-200 ${
                  category.color === 'storj-blue' ? 'text-gray-900 group-hover:text-storj-blue' :
                  category.color === 'storj-navy' ? 'text-gray-900 group-hover:text-storj-navy' :
                  'text-gray-900 group-hover:text-gray-600'
                }`}>
                  {category.title}
                </h3>
                <p className="text-storj-muted group-hover:text-gray-700 transition-colors duration-200">
                  {category.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {category.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className={`px-3 py-1.5 rounded-storj text-sm font-medium transition-all duration-200 ${
                    category.color === 'storj-blue' ? 'bg-storj-blue/10 text-storj-blue hover:bg-storj-blue/20' :
                    category.color === 'storj-navy' ? 'bg-storj-navy/10 text-storj-navy hover:bg-storj-navy/20' :
                    'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                    {skill}
                  </span>
                ))}
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                category.color === 'primary-500' ? 'bg-primary-500/5' :
                category.color === 'cyber-500' ? 'bg-cyber-500/5' :
                'bg-purple-500/5'
              }`}></div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/about">
            <button className="px-10 py-4 rounded-full border-2 border-accent-blue/30 text-accent-blue font-semibold text-lg hover:bg-accent-blue/10 hover:border-accent-blue transition-all duration-200 backdrop-blur-sm">
              Learn More About My Journey
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
})

export { SkillsSection }