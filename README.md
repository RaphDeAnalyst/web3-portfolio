# Web3 Portfolio - Data & AI Specialist

A modern, responsive portfolio website showcasing Web3 expertise, built with Next.js 15, TypeScript, and Tailwind CSS. Features advanced animations, wallet integration, and NFT minting capabilities.

## 🚀 Features

### Core Functionality
- **Responsive Design** - Mobile-first approach with smooth animations
- **Dark/Light Mode** - System preference detection with manual toggle
- **Web3 Integration** - Wallet connection with multiple provider support
- **NFT Minting** - Free collectible badges for portfolio visitors
- **Blog System** - Markdown-based articles with search and filtering
- **Contact System** - Professional inquiry form with project scoping

### Technical Highlights
- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS v4** with custom Web3 color palette
- **Performance Optimized** with lazy loading and image optimization
- **SEO Ready** with metadata, sitemap, and structured data
- **Security Headers** for enhanced protection
- **Accessibility** compliant with WCAG guidelines

### Web3 Features
- **Multi-Wallet Support** - MetaMask, WalletConnect, Coinbase, Rainbow
- **Network Switching** - Ethereum, Polygon, BSC, Arbitrum, Optimism
- **ENS Integration** - Display ENS names in navbar when connected
- **NFT Collection** - 4 unique designs with rarity system
- **Mock Implementation** - Demo-ready without blockchain dependencies

## 📦 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS v4, Custom CSS animations
- **Web3**: Custom context provider (mock implementation)
- **Deployment**: Vercel-ready with optimizations
- **Performance**: Image optimization, lazy loading, code splitting

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/web3-portfolio.git
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
│   │   ├── about/          # About page
│   │   ├── blog/           # Blog section
│   │   ├── contact/        # Contact page  
│   │   ├── portfolio/      # Portfolio showcase
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   │   ├── layout/         # Layout components
│   │   └── ui/            # UI components
│   └── lib/               # Utility functions
├── public/                # Static assets
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
- **Personal Info**: Update `src/app/about/page.tsx`
- **Projects**: Modify project data in `src/app/portfolio/page.tsx`
- **Blog Posts**: Add markdown files or update blog data
- **Contact Details**: Update `src/components/ui/contact-info.tsx`

### Web3 Configuration
For production Web3 integration, replace mock providers in:
- `src/lib/web3-context.tsx` - Wallet connection logic
- `src/components/ui/nft-minter.tsx` - NFT minting functionality

## 📈 Performance Optimizations

- **Image Optimization** - WebP/AVIF format support
- **Code Splitting** - Automatic route-based splitting
- **Lazy Loading** - Components loaded on demand
- **Caching** - Static generation with ISR support
- **Bundle Analysis** - Use `npm run analyze` to inspect

## 🔒 Security

- **Content Security Policy** headers configured
- **XSS Protection** enabled
- **Input Validation** on forms
- **Safe External Links** with proper rel attributes

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
- **Email**: hello@web3portfolio.dev
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions for general questions

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first styling approach
- **Vercel** for seamless deployment experience
- **Web3 Community** for inspiration and best practices

---

**Built with ❤️ for the Web3 community**
