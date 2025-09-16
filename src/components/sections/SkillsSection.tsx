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
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background-secondary to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 border border-primary/30 bg-primary/5 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-medium text-primary">Technical Arsenal</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            Skills & <span className="text-primary">Expertise</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed">
            A comprehensive toolkit built through hands-on experience in both traditional and blockchain analytics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="group bg-card border border-border hover:border-border-hover p-4 sm:p-6 lg:p-8 rounded-2xl transition-all duration-300">
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
                  {category.title}
                </h3>
                <p className="text-sm sm:text-base text-foreground-secondary transition-colors duration-200 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {category.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 rounded">
                    {skill}
                  </span>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Link href="/about">
            <button className="btn-outline w-full sm:w-auto min-h-[48px]">
              Learn More About My Journey
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
})

export { SkillsSection }