#!/usr/bin/env node
/**
 * Script to systematically replace console statements with logger calls
 */

const fs = require('fs')
const path = require('path')

// Files to process
const filesToFix = [
  // Admin pages
  'src/app/admin/layout.tsx',
  'src/app/admin/page.tsx',
  'src/app/admin/posts/edit/[slug]/page.tsx',
  'src/app/admin/posts/new/page.tsx',
  'src/app/admin/posts/page.tsx',
  'src/app/admin/profile/page.tsx',
  'src/app/admin/projects/edit/[id]/page.tsx',
  'src/app/admin/projects/new/page.tsx',
  'src/app/admin/projects/page.tsx',

  // API routes
  'src/app/api/admin/auth/route.ts',

  // Blog pages
  'src/app/blog/page.tsx',
  'src/app/blog/[slug]/page.tsx',
  'src/app/portfolio/page.tsx',

  // Components
  'src/components/ui/blog-card.tsx',
  'src/components/ui/contact-form.tsx',
  'src/components/ui/contact-info.tsx',
  'src/components/ui/image-upload.tsx',
  'src/components/ui/image-viewer.tsx',
  'src/components/ui/navbar.tsx',
  'src/components/ui/nft-minter.tsx',
  'src/components/ui/profile-avatar.tsx',
  'src/components/ui/profile-card.tsx',
  'src/components/ui/profile-picture-upload.tsx',
  'src/components/ui/social-links.tsx',
  'src/components/ui/utterances-comments.tsx',
  'src/components/ui/wallet-connect.tsx',
  'src/components/admin/blog-post-editor.tsx',
  'src/components/admin/project-editor.tsx',
  'src/components/admin/media-upload/index.tsx',
  'src/components/admin/media-upload/MediaLibrary.tsx',

  // Lib files
  'src/lib/blog-service.ts',
  'src/lib/data-migration.ts',
  'src/lib/github-comments.ts',
  'src/lib/media-migration.ts',
  'src/lib/media-service-hybrid.ts',
  'src/lib/media-service-supabase.ts',
  'src/lib/profile-service.ts',
  'src/lib/project-service.ts',
  'src/lib/supabase.ts',
  'src/lib/theme-provider.tsx',
  'src/lib/view-tracking.ts',
  'src/lib/web3-context.tsx',
]

function fixConsoleStatements(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`)
    return false
  }

  let content = fs.readFileSync(filePath, 'utf-8')
  let modified = false

  // Check if logger is already imported
  const hasLoggerImport = content.includes("from '@/lib/logger'") || content.includes("from '../../lib/logger'") || content.includes("from '../lib/logger'") || content.includes("from './lib/logger'")

  // Add logger import if not present and file has console statements
  if (!hasLoggerImport && /console\.(log|error|warn|info|debug)/.test(content)) {
    // Determine correct import path based on file location
    let importPath = '@/lib/logger'
    if (filePath.includes('src/pages/api/')) {
      importPath = '../../lib/logger'
    } else if (filePath.includes('src/lib/')) {
      importPath = './logger'
    }

    // Find the best place to add the import (after other imports)
    const lines = content.split('\n')
    let insertIndex = 0

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('import ') && !lines[i].includes('type ')) {
        insertIndex = i + 1
      }
      if (lines[i].trim() === '' && insertIndex > 0) {
        break
      }
    }

    lines.splice(insertIndex, 0, `import { logger } from '${importPath}'`)
    content = lines.join('\n')
    modified = true
  }

  // Replace console statements with logger equivalents
  const replacements = [
    {
      pattern: /console\.error\((.*)\)/g,
      replacement: (match, args) => {
        // Handle different console.error patterns
        if (args.includes(',')) {
          const parts = args.split(',', 2)
          const message = parts[0].trim()
          const context = parts.slice(1).join(',').trim()
          return `logger.error(${message}, ${context})`
        }
        return `logger.error(${args})`
      }
    },
    {
      pattern: /console\.log\((.*)\)/g,
      replacement: (match, args) => `logger.info(${args})`
    },
    {
      pattern: /console\.warn\((.*)\)/g,
      replacement: (match, args) => `logger.warn(${args})`
    },
    {
      pattern: /console\.info\((.*)\)/g,
      replacement: (match, args) => `logger.info(${args})`
    },
    {
      pattern: /console\.debug\((.*)\)/g,
      replacement: (match, args) => `logger.info(${args})`
    }
  ]

  for (const replacement of replacements) {
    const before = content
    content = content.replace(replacement.pattern, replacement.replacement)
    if (content !== before) modified = true
  }

  // Write back if modified
  if (modified) {
    fs.writeFileSync(filePath, content)
    console.log(`✅ Fixed console statements in: ${filePath}`)
    return true
  }

  return false
}

// Run the fixes
console.log('🔧 Starting console statement cleanup...\n')

let fixedCount = 0
for (const filePath of filesToFix) {
  if (fixConsoleStatements(filePath)) {
    fixedCount++
  }
}

console.log(`\n✨ Console cleanup complete! Fixed ${fixedCount} files.`)
console.log('ℹ️  Run "npm run lint" to verify all console statements are removed.')