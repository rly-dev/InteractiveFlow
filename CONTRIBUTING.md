# Contributing to InteractiveFlow

Thank you for your interest in contributing to InteractiveFlow! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/InteractiveFlow.git
   cd InteractiveFlow
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/rly-dev/InteractiveFlow.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the TypeScript type-check:
   ```bash
   npm run lint
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Watch mode for development:
   ```bash
   npm run dev
   ```

## Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes in the `src/` directory.
3. Ensure TypeScript compiles cleanly:
   ```bash
   npm run lint
   ```
4. Build to verify output:
   ```bash
   npm run build
   ```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Description |
|---|---|
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation changes |
| `refactor:` | Code refactoring (no feature/fix) |
| `chore:` | Maintenance tasks |
| `test:` | Adding or updating tests |

**Examples:**
```
feat: add FlowPaginator first/last page buttons
fix: handle expired interactions in paginator
docs: update API reference for FlowContainer
```

## Pull Request Process

1. **Update your branch** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. **Push** your branch to your fork:
   ```bash
   git push origin feat/my-feature
   ```
3. **Open a Pull Request** against `main` on the upstream repository.
4. Fill out the PR template completely.
5. Ensure the CI checks pass.
6. Wait for a maintainer review.

### PR Requirements

- [ ] TypeScript compiles with no errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] All public APIs have JSDoc documentation
- [ ] Commit messages follow Conventional Commits

## 💡 Questions?

If you have questions or need help, feel free to open a [Discussion](https://github.com/rly-dev/InteractiveFlow/discussions) or an [Issue](https://github.com/rly-dev/InteractiveFlow/issues).

---

Thank you for contributing! 🎉
