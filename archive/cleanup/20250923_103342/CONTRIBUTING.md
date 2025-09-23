# Contributing to Web3 Portfolio

First off, thank you for considering contributing to this Web3 Portfolio project! 🎉

This document provides guidelines and information for contributors. By participating in this project, you agree to abide by its terms.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## 🤝 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and encourage diverse perspectives
- **Be collaborative**: Work together and help each other succeed
- **Be professional**: Keep discussions focused and constructive

## 🚀 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report:

1. Use the bug report template
2. Provide detailed steps to reproduce
3. Include screenshots if applicable
4. Specify your environment (browser, device, OS)

### ✨ Suggesting Features

Feature suggestions are welcome! Please:

1. Use the feature request template
2. Explain the problem you're trying to solve
3. Describe your proposed solution
4. Consider the Web3/analytics context of the project

### 📚 Improving Documentation

Documentation improvements are always appreciated:

- Fix typos or clarify confusing sections
- Add missing documentation
- Improve code comments
- Update outdated information

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of Next.js, React, and TypeScript
- Understanding of Web3 concepts (helpful but not required)

### Local Setup

1. **Fork the repository**
   ```bash
   # Click the Fork button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/web3-portfolio.git
   cd web3-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   # Edit .env.local with your secure values
   ```

   **IMPORTANT**: For security, you must set these environment variables:
   ```bash
   # .env.local
   JWT_SECRET=your-super-secure-random-jwt-secret-key-minimum-32-characters
   ADMIN_PASSWORD=your-secure-admin-password
   ```

   Generate a strong JWT secret (you can use online generators or this command):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Visit `http://localhost:3000`

## 🛠 Admin Dashboard

This portfolio includes an admin dashboard for content management. Admin access is restricted and protected by authentication.

**For Contributors:**
- Admin features are secured and require authorization
- Contact the repository owner at matthewraphael@matthewraphael.xyz for access if you need to work on admin-related features
- All admin routes are protected by authentication middleware

## 🔄 Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/add-wallet-connection`
- `fix/mobile-navigation-bug`
- `docs/update-readme`
- `refactor/optimize-image-loading`

### Commit Messages

Follow conventional commit format:

```
type(scope): brief description

Detailed explanation if needed

- Additional details
- Breaking changes noted
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(portfolio): add Web3 project filtering
fix(mobile): resolve navigation overlay issue
docs(readme): update installation instructions
```

## 🎨 Style Guidelines

### Code Style

- **TypeScript**: Use proper typing, avoid `any`
- **React**: Use functional components with hooks
- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **Imports**: Group and sort imports logically

### Component Structure

```typescript
'use client' // Only if needed

import { useState } from 'react'
import { ExternalLibrary } from 'external-library'
import { InternalComponent } from '@/components/internal'
import { utils } from '@/lib/utils'

interface ComponentProps {
  title: string
  isVisible?: boolean
}

export function Component({ title, isVisible = true }: ComponentProps) {
  const [state, setState] = useState(false)

  // Component logic here

  return (
    <div className="component-container">
      {/* JSX here */}
    </div>
  )
}
```

### CSS/Tailwind Guidelines

- Use Tailwind classes when possible
- Create custom CSS only when necessary
- Follow mobile-first responsive design
- Use semantic color names from the theme

### File Organization

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   ├── sections/       # Page sections
│   └── layout/         # Layout components
├── lib/                # Utilities and services
└── types/              # TypeScript type definitions
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for new features and bug fixes
- Use descriptive test names
- Test both happy path and edge cases
- Mock external dependencies

Example test structure:

```typescript
import { render, screen } from '@testing-library/react'
import { Component } from './Component'

describe('Component', () => {
  it('should render with correct title', () => {
    render(<Component title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    // Test implementation
  })
})
```

## 📤 Submitting Changes

### Before Submitting

1. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

2. **Lint your code**
   ```bash
   npm run lint
   ```

3. **Check TypeScript**
   ```bash
   npm run type-check
   ```

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Update CHANGELOG.md** for significant changes
4. **Fill out the PR template** completely
5. **Request review** from maintainers

### PR Review Criteria

Your PR should:
- ✅ Pass all automated checks
- ✅ Have clear, descriptive commits
- ✅ Include appropriate tests
- ✅ Follow code style guidelines
- ✅ Update documentation if needed
- ✅ Not break existing functionality

## 🏷️ Issue Labels

We use these labels to organize issues:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to docs
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `web3`: Web3/blockchain related
- `ui/ux`: User interface/experience
- `performance`: Performance related

## 🆘 Getting Help

If you need help:

1. **Check existing documentation** and issues
2. **Ask in discussions** for general questions
3. **Create an issue** for bugs or feature requests
4. **Reach out** via email: matthewraphael@matthewraphael.xyz

## 🎯 Web3 Specific Contributions

This portfolio showcases Web3 analytics work. When contributing Web3 features:

- **Understand the context**: This is an analytics portfolio
- **Test with real data**: Use actual blockchain data when possible
- **Consider performance**: Blockchain queries can be slow
- **Document API usage**: Include rate limits and error handling
- **Validate data accuracy**: Double-check calculations and metrics

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing! 🙏**

Your contributions help make this project better for everyone in the Web3 community.