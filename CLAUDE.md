# Project Guidelines

## React Components

- Reuse existing common components when possible
- When creating new components, consider if they can be abstracted for use in multiple places

## Code Cleanliness

- Keep component styles in a `styles` object. Styles should not be managed inline

## Commit Messages

- Use conventional commit prefixes for all commits:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for formatting changes
  - `refactor:` for code refactoring
  - `test:` for test additions or modifications
  - `chore:` for maintenance tasks

## Workflow

- After completing each task from DESIGN.md, create a commit with those changes
- Run the linter (`npm run lint` in the client directory) before committing changes

## Data Schema

- Fetch https://the404.marlin-peacock.ts.net:3001/openapi.json to understand the server's data schema
