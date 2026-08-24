# Project Coordination Rules

## Source of truth
- GitHub repository `raoufaltelawi1980-tech/byhour4sy` is the single source of truth for application code and public assets.
- Production is deployed by Vercel from the GitHub `main` branch.
- Supabase is the backend source of truth for database, authentication, storage, and Edge Functions.

## Change policy
- AI agents must not make independent changes in Vercel or Supabase that duplicate or conflict with GitHub-managed application code.
- Code and public assets must be changed in GitHub first.
- Database/schema changes must be made through versioned SQL/migrations in GitHub and then applied to Supabase.
- Before changing an existing feature, inspect the current implementation and reuse existing files rather than creating competing copies.
- Never delete or replace an asset without checking all references to it.
- After a GitHub change, verify the Vercel production deployment and report the commit/deployment that is live.

## Environments
- `main` = production.
- Development work should use a separate branch and be merged into `main` only after verification.

## Agent handoff
- Read this file before modifying the project.
- Treat the latest GitHub commit as authoritative when sources disagree.
- Do not redeploy an older Vercel deployment to solve a code change.
