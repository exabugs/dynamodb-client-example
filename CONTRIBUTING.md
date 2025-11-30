# Contributing to DynamoDB Client Example

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/dynamodb-client-example.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes: `make test && make lint`
6. Commit your changes: `git commit -m "feat: add your feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

```bash
# Install dependencies
make install

# Build packages
make build

# Run tests
make test

# Run linter
make lint

# Format code
make format
```

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that do not affect the meaning of the code
- `refactor:` - A code change that neither fixes a bug nor adds a feature
- `perf:` - A code change that improves performance
- `test:` - Adding missing tests or correcting existing tests
- `chore:` - Changes to the build process or auxiliary tools

Examples:

```
feat: add user authentication
fix: resolve DynamoDB connection timeout
docs: update QUICKSTART guide
refactor: simplify shadow config generation
```

## Code Style

- Use TypeScript for all new code
- Follow ESLint rules: `make lint`
- Format code with Prettier: `make format`
- Write JSDoc comments in Japanese for functions and classes
- Keep functions under 50 lines when possible

## Testing

- Write unit tests for new features
- Ensure all tests pass: `make test`
- Maintain test coverage above 80%
- Test files should be placed in `__tests__` directories

## Documentation

- Update README.md if you change functionality
- Update QUICKSTART.md if you change setup process
- Add JSDoc comments to new functions
- Update steering files in `.kiro/steering/` if needed

## Pull Request Process

1. Ensure all tests pass
2. Update documentation as needed
3. Add a clear description of your changes
4. Link any related issues
5. Wait for review from maintainers

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## Questions?

Feel free to open an issue with the `question` label.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
