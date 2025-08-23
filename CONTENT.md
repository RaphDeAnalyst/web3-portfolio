# Content Management Guide

This guide explains how to easily add new blog posts and projects to your portfolio website.

## Adding New Blog Posts

### Step 1: Add Blog Post Metadata

Edit `src/data/blog-posts.ts` and add a new blog post object to the `blogPosts` array:

```typescript
{
  title: "Your Blog Post Title",
  summary: "A compelling 1-2 sentence summary that will appear in the blog list.",
  date: "Dec 25, 2024", // Format: "MMM DD, YYYY"
  readTime: "5 min read", // Estimate based on content length
  tags: ["Tag1", "Tag2", "Tag3"], // 3-5 relevant tags
  slug: "your-post-url-slug", // Must be unique, lowercase, use hyphens
  category: "Learning", // Must match a category in blogCategories
  featured: false, // Set to true to feature prominently
  author: { name: "Your Name" }
}
```

**Important Notes:**
- `slug` must be unique and URL-friendly (lowercase, hyphens instead of spaces)
- `category` must be one of: "Learning", "Analytics", "Web3", "Tutorial", "AI"
- Use consistent date format: "Dec 25, 2024"

### Step 2: Add Blog Post Content

Edit `src/data/blog-content.ts` and add a new entry:

```typescript
export const blogContent: { [key: string]: string } = {
  // ... existing content ...
  
  "your-post-url-slug": `# Your Blog Post Title

Your blog content goes here in Markdown format.

## Subheading

- Bullet points work
- **Bold text** and *italic text*
- Code blocks work too:

\`\`\`python
def hello_world():
    print("Hello, Web3!")
\`\`\`

> Blockquotes for important information

[Links work too](https://example.com)
`
}
```

**Content Tips:**
- Write in Markdown format
- Use `#` for main heading, `##` for subheadings
- Include code examples with syntax highlighting
- Add images with `![Alt text](image-url)`
- Use blockquotes (`>`) for important callouts

## Adding New Projects

### Step 1: Add Project Data

Edit `src/data/projects.ts` and add a new project object to the `projects` array:

```typescript
{
  title: "Your Project Name",
  description: "Detailed description of what the project does and its impact. Include key features and technologies used.",
  tech: ["Python", "React", "Solidity"], // Array of technologies
  category: "Analytics", // Must match projectCategories
  status: "Live" as const, // "Live", "Development", or "Beta"
  demoUrl: "https://your-demo.com", // Use "#" if no demo
  githubUrl: "https://github.com/username/repo", // Use "#" if private
  metrics: {
    // Include 2-3 relevant metrics
    users: "500+",
    performance: "95%",
    volume: "$10K+"
  },
  featured: false // Set to true to highlight
}
```

**Project Categories:**
- "Analytics"
- "Smart Contracts" 
- "Infrastructure"
- "AI x Web3"
- "DeFi"
- "Dashboards"
- "Learning"

**Status Options:**
- `"Live"` - Production ready and deployed
- `"Development"` - Currently being built
- `"Beta"` - In testing phase

## File Structure

```
src/
├── data/
│   ├── blog-posts.ts     # Blog metadata (title, summary, tags, etc.)
│   ├── blog-content.ts   # Full blog post content in Markdown
│   └── projects.ts       # Project data and metadata
├── app/
│   ├── blog/
│   │   ├── page.tsx      # Blog listing page
│   │   └── [slug]/
│   │       └── page.tsx  # Individual blog post pages
│   └── portfolio/
│       └── page.tsx      # Portfolio page
```

## Quick Templates

### Blog Post Template
Copy this template when adding new blog posts:

```typescript
// In blog-posts.ts
{
  title: "",
  summary: "",
  date: "Jan 01, 2025",
  readTime: "5 min read",
  tags: [""],
  slug: "",
  category: "Learning",
  featured: false,
  author: { name: "Data Analyst" }
}

// In blog-content.ts
"slug-here": `# Title Here

Content goes here...
`
```

### Project Template
Copy this template when adding new projects:

```typescript
{
  title: "",
  description: "",
  tech: [""],
  category: "Learning",
  status: "Development" as const,
  demoUrl: "#",
  githubUrl: "#",
  metrics: {
    key1: "value1",
    key2: "value2"
  },
  featured: false
}
```

## Publishing Workflow

1. **Add content** to the appropriate data files
2. **Test locally** - run `npm run dev` and check your content
3. **Commit changes** - the site will automatically rebuild
4. **Deploy** - changes go live automatically

## Content Guidelines

### Blog Posts
- **Length**: 500-2000 words optimal
- **Structure**: Use clear headings and subheadings
- **Code**: Include practical examples and code snippets
- **Images**: Add relevant screenshots or diagrams
- **Tags**: Use 3-5 descriptive tags for discovery

### Projects  
- **Description**: Be specific about impact and features
- **Metrics**: Include real numbers when possible
- **Status**: Keep status updated as projects evolve
- **Links**: Ensure demo and GitHub links work

## Troubleshooting

### Common Issues

**Blog post not showing up:**
- Check that the slug is unique
- Verify the category exists in `blogCategories`
- Make sure both metadata and content are added

**Project images not loading:**
- Use absolute URLs for external images
- Check image file paths and extensions

**Build errors:**
- Ensure all required fields are filled
- Check for missing commas in arrays
- Verify TypeScript syntax

### Need Help?
If you encounter issues:
1. Check the browser console for errors
2. Run `npm run build` to test locally
3. Compare your additions to existing content structure