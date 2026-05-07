'use client'

export default function WorkPage() {
  const projects = [
    {
      id: 1,
      name: 'Base Network Activity Dashboard',
      description: 'Real-time analysis of Base L2 network activity, tracking daily transactions, unique users, and protocol composition. The data revealed Base growing 40% month-over-month driven by gaming and DeFi protocols.',
      tags: ['Base', 'L2 Activity'],
      duneUrl: 'https://dune.com/rraphael/base-network-activity'
    },
    // More projects will be added as you create them
  ]

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold">Work</h1>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.duneUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 sm:p-8 border border-border rounded hover:border-foreground hover:shadow-lg transition-all duration-300"
            >
              {/* Project Name */}
              <h2 className="text-xl font-semibold mb-3 group-hover:opacity-70 transition-opacity">
                {project.name}
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base opacity-70 mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block text-xs font-medium px-2 py-1 bg-foreground/10 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Link */}
              <div className="text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                View on Dune ↗
              </div>
            </a>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center opacity-50 py-12">
            <p>Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}
