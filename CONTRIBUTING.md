# Contributing to ReCircuit

Thank you for your interest in contributing to ReCircuit! This document provides guidelines and instructions for contributing.

## 🎯 How to Contribute

### Reporting Bugs

1. Check existing issues first
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable

### Suggesting Features

1. Open an issue with the "feature request" label
2. Describe the problem you're solving
3. Explain your proposed solution
4. Note any alternatives considered

### Code Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit with conventional commits
6. Push to your fork
7. Create a Pull Request

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Frontend Setup

```bash
cd Code
npm install
npm run dev
```

### Backend Setup

```bash
cd Code/server
npm install
npx prisma db push
node src/utils/seed.js
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` in both `Code/` and `Code/server/`:

```bash
cp Code/.env.example Code/.env
cp Code/server/.env.example Code/server/.env
```

Fill in the required values (see README.md for details).

## 📝 Coding Standards

### JavaScript/JSX

- Use ES6+ syntax
- Prefer functional components with hooks
- Use meaningful variable names
- Add comments for complex logic
- Follow ESLint rules

### CSS/Tailwind

- Use Tailwind utility classes
- Follow the design system tokens
- Avoid custom CSS when possible
- Use semantic class names

### Git Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: code style changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 🧪 Testing

### Running Tests

```bash
# Frontend lint
cd Code
npm run lint

# Build verification
npm run build

# Backend
cd Code/server
npm run dev
```

### Writing Tests

- Test component rendering
- Test user interactions
- Test API endpoints
- Mock external services
- Aim for critical path coverage

## 🔍 Code Review

### Before Submitting PR

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Documentation updated (if needed)
- [ ] No console errors
- [ ] Responsive on mobile

### PR Template

```markdown
## Description
[Describe your changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing done
- [ ] Mobile responsive

## Screenshots (if applicable)
[Add screenshots]

## Related Issues
Closes #[issue number]
```

## 🎨 Design Guidelines

### Color Palette

- Forest (Primary): `#22c55e` to `#14532d`
- Gold (Accent): `#f59e0b` to `#78350f`
- Sage (Secondary): `#7a8a6a` to `#343b2f`
- Cream (Background): `#fefdfb` to `#e6c888`
- Ink (Text): `#525252` to `#171717`

### Typography

- Display/H1: Poppins Bold
- Body: Manrope Regular
- Line height: 1.7 for body text

### Components

- Use glass morphism (`.glass`, `.glass-card`)
- Follow spacing tokens (4px base)
- Use semantic color tokens
- Ensure accessibility (WCAG 2.1 AA)

## 🐛 Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - Urgent fixes
- `priority: low` - Nice to have

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Documentation](https://stripe.com/docs)

## ❓ Questions?

- Open a GitHub Discussion
- Join our Discord (if available)
- Email: hello@recircuit.app

---

Thank you for contributing to ReCircuit! Together, we're making e-waste management accessible and sustainable. 🔋♻️
