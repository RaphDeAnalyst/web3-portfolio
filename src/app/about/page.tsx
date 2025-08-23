import { ProfileCard } from '@/components/ui/profile-card'
import { SkillCard } from '@/components/ui/skill-card'

export default function About() {
  const skills = [
    {
      title: 'Core Data Analytics',
      description: 'Python & SQL Foundation',
      icon: '📊',
      color: 'primary-500',
      gradient: 'from-primary-500/20 to-primary-500/5',
      skills: [
        'Python for Data Analysis',
        'SQL Database Querying',
        'Data Visualization (Matplotlib, Seaborn)',
        'Pandas & NumPy Libraries',
        'Excel & Statistical Analysis'
      ]
    },
    {
      title: 'Web3 Analytics (Learning)',
      description: 'Blockchain Data Exploration',
      icon: '⚡',
      color: 'cyber-500',
      gradient: 'from-cyber-500/20 to-cyber-500/5',
      skills: [
        'Dune Analytics Dashboards',
        'On-chain Data Queries',
        'Solidity Basics',
        'Blockchain Data Structures',
        'DeFi Protocol Analysis'
      ]
    },
    {
      title: 'Statistical Analysis & AI',
      description: 'Statistical Modeling',
      icon: '🔬',
      color: 'purple-500',
      gradient: 'from-purple-500/20 to-purple-500/5',
      skills: [
        'Statistical Modeling',
        'Predictive Analytics',
        'Regression Analysis',
        'A/B Testing & Hypothesis Testing',
        'Basic Machine Learning (Scikit-learn)'
      ]
    }
  ]

  const journey = [
    {
      year: '2020',
      title: 'Started Data Analysis Career',
      description: 'Began working as a data analyst in traditional finance, mastering Python and SQL',
      icon: '📊'
    },
    {
      year: '2021',
      title: 'Advanced Analytics Skills',
      description: 'Developed expertise in statistical modeling and predictive analytics',
      icon: '📈'
    },
    {
      year: '2022',
      title: 'Discovered Blockchain',
      description: 'First exposure to blockchain technology and cryptocurrency markets',
      icon: '🔍'
    },
    {
      year: '2023',
      title: 'Web3 Learning Journey',
      description: 'Started learning Dune Analytics and exploring on-chain data analysis',
      icon: '🌱'
    },
    {
      year: '2024',
      title: 'Solidity & DeFi Study',
      description: 'Currently learning Solidity basics and studying DeFi protocol mechanics',
      icon: '⚡'
    },
    {
      year: '2025',
      title: 'Career Transition Goal',
      description: 'Actively seeking opportunities in Web3 data analytics and blockchain research',
      icon: '🎯'
    }
  ]

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-cyber-500/30 bg-cyber-500/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 bg-cyber-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-cyber-500">About Me</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="text-gradient">Transitioning from</span>
            <br />
            <span className="text-foreground">Web2 to Web3 Analytics</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Leveraging my <span className="text-primary-500 font-medium">traditional data analytics</span> background to explore 
            <span className="text-cyber-500 font-medium"> blockchain insights</span> and 
            <span className="text-purple-500 font-medium"> decentralized finance</span>.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <ProfileCard />
            </div>

            {/* Biography and Journey */}
            <div className="lg:col-span-2 space-y-12">
              {/* Biography */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">My Story</h2>
                  <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
                    <p>
                      I'm a <span className="text-cyber-500 font-medium">data analyst transitioning from Web2 to Web3</span>, 
                      bringing strong foundations in Python, SQL, and statistical analysis to the blockchain space. 
                      My journey started with traditional data analytics in finance, where I developed expertise 
                      in data visualization, statistical modeling, and predictive analytics.
                    </p>
                    <p>
                      Currently, I'm expanding my skills into <span className="text-primary-500 font-medium">blockchain 
                      data analysis</span> through platforms like Dune Analytics, while learning Solidity basics 
                      and exploring DeFi protocols. I'm particularly interested in how traditional statistical 
                      methods can be applied to on-chain data and tokenomics analysis.
                    </p>
                    <p>
                      My goal is to become proficient in <span className="text-purple-500 font-medium">Web3 analytics</span> 
                      by combining my existing data science skills with blockchain-specific knowledge. I'm eager 
                      to contribute to projects that need both traditional analytical rigor and Web3 innovation.
                    </p>
                  </div>
                </div>

                {/* Values */}
                <div className="p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-primary-500/5 to-cyber-500/5 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Core Values</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { 
                        icon: '🔍', 
                        title: 'Transparency', 
                        description: 'Open-source mindset with verifiable results' 
                      },
                      { 
                        icon: '🌐', 
                        title: 'Decentralization', 
                        description: 'Empowering distributed systems and communities' 
                      },
                      { 
                        icon: '⚡', 
                        title: 'Innovation', 
                        description: 'Pushing boundaries with cutting-edge solutions' 
                      }
                    ].map((value, index) => (
                      <div key={index} className="text-center space-y-3">
                        <div className="text-3xl">{value.icon}</div>
                        <h4 className="text-lg font-semibold text-foreground">{value.title}</h4>
                        <p className="text-sm text-foreground/70">{value.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Technical <span className="text-gradient">Expertise</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              A comprehensive skill set spanning blockchain development, data analytics, and artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <SkillCard key={index} {...skill} />
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              My <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Key milestones in my Web3 and AI development career
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-cyber-500 to-purple-500 rounded-full"></div>
            
            <div className="space-y-12">
              {journey.map((item, index) => (
                <div key={index} className="relative flex items-start space-x-8">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-2xl border-4 border-background shadow-lg">
                    {item.icon}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm card-hover">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                        <span className="text-sm font-medium text-cyber-500 bg-cyber-500/10 px-3 py-1 rounded-full">
                          {item.year}
                        </span>
                      </div>
                      <p className="text-foreground/70 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary-500/10 via-cyber-500/10 to-purple-500/10 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Let's collaborate on your next Web3 project and unlock the potential of blockchain data and AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary-500/30">
                Start a Project
              </button>
              <button className="px-8 py-4 rounded-full border border-gray-300 dark:border-gray-700 text-foreground font-semibold text-lg hover:border-cyber-500 hover:text-cyber-500 transition-colors duration-200">
                Download Resume
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}