# Contributing

This is a timeboxed build. Optimize for a working, tested, demoable slice over broad unfinished
surface area.

## Branches

- `main` stays deployable.
- Work on `feat/<slice>`, `fix/<issue>`, or `docs/<topic>`.
- Rebase or merge `main` before opening a pull request.

## Before you push

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
```

For UI work, also run `npm run test:e2e` and check the golden path at mobile width.

## Pull requests

- One vertical slice per pull request.
- Link the discovery artifact or issue.
- Include screenshots for UI changes.
- Include a rollback note for schema, auth, or infrastructure changes.
- Never commit `.env`, secrets, generated build output, or real user data.

## Commit messages

Use a short imperative subject and a body that explains why:

```text
feat: add workspace-scoped audit log

Every mutation now writes an audit record with actor, entity, and request id.
```

## Definition of done

Read [docs/QUALITY-BAR.md](docs/QUALITY-BAR.md). A feature is not done until its loading, empty,
error, and unauthorized states exist, and the release gate is green.
