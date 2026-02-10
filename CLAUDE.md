# Project Guidelines

## Design Reference
- Refer to the `mockups/` directory for design reference and UI specifications
- Follow the design patterns and layouts shown in the mockups

## Implementation Guidance
- Follow the implementation plan (DESIGN.md or similar) for project structure and architecture decisions
- Consult the plan when making technical decisions

## React Components
- Reuse existing common components when possible
- When creating new components, consider if they can be abstracted for use in multiple places

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
