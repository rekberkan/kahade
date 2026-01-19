# Contributing to Kahade

Thank you for your interest in contributing to Kahade! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use cases
   - Potential implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `yarn test`
5. Run linter: `yarn lint`
6. Commit with clear message: `git commit -m 'feat: add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## Development Setup

```bash
# Clone repository
git clone https://github.com/rekberkan/kahade.git
cd kahade/kahade-backend

# Install dependencies
yarn install

# Setup environment
cp .env.example .env.development

# Run database
docker-compose up -d postgres redis

# Run migrations
yarn prisma:migrate

# Start development server
yarn start:dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Follow existing code style
- Use meaningful variable names
- Add types to all functions

### NestJS

- Follow NestJS best practices
- Use dependency injection
- Create modular, reusable code
- Use DTOs for validation

### Git Commit Messages

Follow Conventional Commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/config changes

### Code Review

All submissions require review:

1. Code quality
2. Test coverage
3. Documentation
4. Performance impact

## Testing

### Unit Tests

```bash
yarn test
```

### E2E Tests

```bash
yarn test:e2e
```

### Coverage

```bash
yarn test:cov
```

Aim for >80% code coverage.

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for public APIs
- Update API documentation
- Add migration guides for breaking changes

## Questions?

Feel free to ask questions by:

- Opening an issue
- Reaching out to maintainers
- Joining our community chat

Thank you for contributing!
