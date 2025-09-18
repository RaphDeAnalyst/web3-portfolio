# Web3 Portfolio - Personal Portfolio Website

<div align="center">

![Web3 Portfolio](https://img.shields.io/badge/Portfolio-Live-brightgreen?style=for-the-badge&logo=vercel)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**🌐 [Live Demo](https://matthewraphael.xyz) | 📊 [View Analytics Projects](https://dune.com/raphdeanalyst)**

</div>

A modern, responsive Web3 analytics portfolio showcasing blockchain data analysis, DeFi dashboards, and on-chain insights. Built with Next.js 14, featuring a comprehensive blog system, project showcase, admin dashboard, and professional contact functionality.

## 🎯 Quick Start

```bash
# Clone the repository
git clone https://github.com/RaphDeAnalyst/web3-portfolio.git
cd web3-portfolio

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio locally.

## 🚀 Features

### Core Functionality
- **Responsive Design** - Mobile-first approach with smooth animations
- **Dark/Light Mode** - Theme switching with next-themes
- **Blog System** - Full CMS with admin dashboard for creating and editing posts
- **Project Portfolio** - Showcase of projects with detailed descriptions
- **Contact System** - Professional contact form
- **Admin Dashboard** - Complete content management system

### Technical Highlights
- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** with custom styling and animations
- **Supabase Integration** - Backend database and services
- **Performance Optimized** with lazy loading and image optimization
- **SEO Ready** - Sitemap, metadata, and structured data
- **Testing Setup** - Vitest with React Testing Library
- **Analytics** - Vercel Analytics integration

### Admin Features
- **Blog Management** - Create, edit, and publish blog posts
- **Project Management** - Add and manage portfolio projects
- **Media Management** - Upload and organize media files
- **Profile Management** - Update personal information and settings

## 📦 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS animations
- **Backend**: Supabase (database, auth, storage)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Testing**: Vitest, React Testing Library
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel-ready with optimizations

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/RaphDeAnalyst/web3-portfolio.git
cd web3-portfolio
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
Visit `http://localhost:3000` to see the portfolio

### Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Use `npm run build` command
- **Railway**: Supports Next.js out of the box  
- **DigitalOcean App Platform**: Use Next.js preset

## 📁 Project Structure

```
web3-portfolio/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin dashboard
│   │   │   ├── posts/      # Blog post management
│   │   │   ├── projects/   # Project management
│   │   │   ├── media/      # Media management
│   │   │   └── profile/    # Profile settings
│   │   ├── blog/           # Blog section
│   │   │   └── [slug]/     # Individual blog posts
│   │   ├── contact/        # Contact page
│   │   ├── portfolio/      # Portfolio showcase
│   │   ├── about/          # About page
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   │   ├── admin/          # Admin-specific components
│   │   ├── sections/       # Page sections
│   │   ├── layout/         # Layout components
│   │   ├── ui/            # UI components
│   │   ├── seo/           # SEO components
│   │   └── error/         # Error handling components
│   └── lib/               # Utility functions and services
├── public/                # Static assets
├── scripts/               # Utility scripts
├── tailwind.config.ts     # Tailwind configuration
├── next.config.ts         # Next.js configuration
└── package.json          # Dependencies
```

## 🎨 Customization

### Colors & Theming
Update colors in `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    500: '#0ea5e9', // Customize primary color
  },
  cyber: {
    500: '#22c55e', // Customize accent color  
  },
}
```

### Content Updates
- **Personal Info**: Use the admin dashboard at `/admin/profile`
- **Projects**: Manage projects through `/admin/projects`
- **Blog Posts**: Create and edit posts at `/admin/posts`
- **Media Files**: Upload and manage media at `/admin/media`

### Supabase Configuration
Set up your Supabase project and update environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- Configure database tables for posts, projects, and profile data

## 📈 Performance Optimizations

- **Image Optimization** - WebP/AVIF format support
- **Code Splitting** - Automatic route-based splitting
- **Lazy Loading** - Components loaded on demand
- **Caching** - Static generation with ISR support
- **Testing** - Run `npm test` for unit tests

## 🔒 Security

- **Content Security Policy** headers configured
- **XSS Protection** enabled
- **Input Validation** on forms
- **Safe External Links** with proper rel attributes

## 🛠 Developer Features

### Admin Dashboard
This portfolio includes a secure admin dashboard for content management:

- **Blog Management** - Create, edit, and publish blog posts
- **Project Management** - Add and manage portfolio projects
- **Media Management** - Upload and organize media files
- **Profile Management** - Update personal information and settings

**For Authorized Users:**
- Admin dashboard provides full content management capabilities
- Authentication system protects administrative functions
- Contact the repository owner for access credentials if you're a legitimate contributor

## 📝 SEO Features

- **Meta Tags** - Comprehensive Open Graph and Twitter cards
- **Structured Data** - JSON-LD for rich snippets  
- **Sitemap** - Automatically generated XML sitemap
- **Robots.txt** - Search engine crawler instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For questions and support:
- **Email**: matthewraphael@matthewraphael.xyz
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions for general questions

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first styling approach
- **Supabase** for the backend infrastructure
- **Vercel** for seamless deployment experience

---

**Built with ❤️ by Matthew Raphael**
