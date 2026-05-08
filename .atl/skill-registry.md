# Skill Registry — erronka2025_js

Generated: 2026-05-08

---

## User Skills (`~/.claude/skills/`)

### branch-pr
**Trigger**: creating, opening, or preparing PRs for review
**Path**: `~/.claude/skills/branch-pr/SKILL.md`
**Compact Rules**:
- Check for linked issue before creating PR; create one if missing
- PR title ≤ 70 chars; use conventional commit prefix
- Body: Summary (bullets) + Test plan (checklist) + 🤖 attribution
- Never force-push to main/master

### chained-pr
**Trigger**: PRs over 400 lines, stacked PRs, review slices
**Path**: `~/.claude/skills/chained-pr/SKILL.md`
**Compact Rules**:
- Split when estimated diff > 400 lines or reviewer load is high
- Each PR must be independently reviewable and mergeable
- Use stacked branch strategy: feat/base → feat/slice-1 → feat/slice-2
- Update base branch references when rebasing

### cognitive-doc-design
**Trigger**: writing guides, READMEs, RFCs, onboarding, architecture, or review-facing docs
**Path**: `~/.claude/skills/cognitive-doc-design/SKILL.md`
**Compact Rules**:
- Lead with the problem, not the solution
- Progressive disclosure: overview → detail, never the reverse
- One concept per heading; headings as navigation, not decoration
- Code examples must be complete and runnable

### comment-writer
**Trigger**: PR feedback, issue replies, reviews, Slack messages, GitHub comments
**Path**: `~/.claude/skills/comment-writer/SKILL.md`
**Compact Rules**:
- Warm and direct; validate the question before correcting
- Separate observation from suggestion
- Link to relevant docs or code when citing issues

### go-testing
**Trigger**: Go tests, go test coverage, Bubbletea teatest, golden files
**Path**: `~/.claude/skills/go-testing/SKILL.md`
**Compact Rules**:
- Use table-driven tests; name subtests descriptively
- Golden files for complex output — never inline large expected strings
- teatest for Bubbletea TUI models

### issue-creation
**Trigger**: creating GitHub issues, bug reports, or feature requests
**Path**: `~/.claude/skills/issue-creation/SKILL.md`
**Compact Rules**:
- Check for duplicate before creating
- Bug: steps to reproduce + expected vs actual + environment
- Feature: problem statement + proposed solution + acceptance criteria

### judgment-day
**Trigger**: judgment day, dual review, adversarial review, juzgar
**Path**: `~/.claude/skills/judgment-day/SKILL.md`
**Compact Rules**:
- Run two independent blind reviews; reconcile conflicts explicitly
- Judge confirms, refutes, or merges findings — never silently drops one side
- Output: confirmed issues (fix), contested issues (explain), false positives (dismiss)

### skill-creator
**Trigger**: new skills, agent instructions, documenting AI usage patterns
**Path**: `~/.claude/skills/skill-creator/SKILL.md`
**Compact Rules**:
- Required frontmatter: name, description (trigger-first, ≤250 chars), license
- Required sections: Activation Contract, Hard Rules, Decision Gates, Execution Steps, Output Contract
- Body target: 180–450 tokens; move examples to references/
- Hard rules must be observable; output contract must be explicit

### work-unit-commits
**Trigger**: implementation, commit splitting, chained PRs, keeping tests and docs with code
**Path**: `~/.claude/skills/work-unit-commits/SKILL.md`
**Compact Rules**:
- Each commit = one logical change that passes CI alone
- Tests travel with the code they test — never a separate "add tests" commit
- Conventional commits: feat/fix/refactor/docs/chore
- No "Co-Authored-By" AI attribution per global CLAUDE.md

---

## Project Skills (`docs/.agents/skills/`)

### accessibility
**Trigger**: "improve accessibility", "a11y audit", "WCAG compliance", "screen reader", "keyboard navigation", "make accessible"
**Path**: `docs/.agents/skills/accessibility/SKILL.md`
**Compact Rules**:
- WCAG 2.2 AA minimum; new criteria: target size (24×24px), focus not obscured, redundant entry, accessible auth
- All interactive elements keyboard-accessible; never remove `:focus-visible`
- Images: descriptive `alt`; decorative: `alt=""`; icon buttons: `aria-label`
- Color contrast: 4.5:1 normal text, 3:1 large text / UI components
- Use native HTML elements over ARIA roles when possible

### frontend-design
**Trigger**: build web components, pages, applications, UI styling, landing pages, dashboards
**Path**: `docs/.agents/skills/frontend-design/SKILL.md`
**Compact Rules**:
- Commit to a bold, intentional aesthetic direction before coding
- Avoid generic AI-default aesthetics; choose a clear conceptual direction
- Real working code — no placeholder content
- Accessibility must not be sacrificed for aesthetics

### next-best-practices
**Trigger**: Next.js file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling (auto-applied, not user-invocable)
**Path**: `docs/.agents/skills/next-best-practices/SKILL.md`
**Compact Rules**:
- In Next.js 16, `middleware.ts` is now `proxy.ts`
- RSC by default; add `'use client'` only when needed (interactivity, hooks, browser APIs)
- Use `generateMetadata()` for per-page SEO; never duplicate static metadata
- Route handlers in `route.ts`; don't mix page.tsx and route.ts in same segment
- `next/image` for all images; `next/font` for fonts (zero layout shift)

### next-cache-components
**Trigger**: PPR, use cache directive, cacheLife, cacheTag, updateTag, Next.js 16 cache
**Path**: `docs/.agents/skills/next-cache-components/SKILL.md`
**Compact Rules**:
- Cache Components enable PPR: mix static + cached + dynamic in one route
- `'use cache'` at function or file level; pair with `cacheLife` and `cacheTag`
- `revalidateTag` / `updateTag` for on-demand invalidation
- Requires Next.js 16+ (this project uses 16.2.4 — fully supported)

### next-upgrade
**Trigger**: Next.js version upgrade, migration, breaking changes
**Path**: `docs/.agents/skills/next-upgrade/SKILL.md`
**Compact Rules**:
- Run `npx @next/codemod` first for automated migrations
- Check breaking changes in Next.js release notes before upgrading

### nodejs-backend-patterns
**Trigger**: Node.js backend patterns, API design, middleware, repository pattern
**Path**: `docs/.agents/skills/nodejs-backend-patterns/SKILL.md`
**Compact Rules**:
- Repository pattern: SQL only in repository layer
- Service layer: business logic only, no SQL, no HTTP
- DTOs validate at the boundary; no DB calls inside DTOs

### nodejs-best-practices
**Trigger**: Node.js best practices, error handling, async patterns
**Path**: `docs/.agents/skills/nodejs-best-practices/SKILL.md`
**Compact Rules**:
- Always handle promise rejections; never swallow errors silently
- Use structured error types (not generic Error) for typed error handling

### seo
**Trigger**: "improve SEO", "optimize for search", "fix meta tags", "add structured data", "sitemap optimization"
**Path**: `docs/.agents/skills/seo/SKILL.md`
**Compact Rules**:
- Title: 50–60 chars, primary keyword near start, unique per page
- Meta description: 150–160 chars, unique, compelling CTA
- Single `<h1>` per page; logical heading hierarchy
- Canonical URL on every page; hreflang for multi-locale sites
- Structured data via JSON-LD (not microdata)
- sitemap.xml must include only canonical, indexable URLs

### typescript-advanced-types
**Trigger**: complex type logic, generic utilities, conditional types, mapped types, template literals, compile-time type safety
**Path**: `docs/.agents/skills/typescript-advanced-types/SKILL.md`
**Compact Rules**:
- Prefer type inference; only annotate where inference fails
- Conditional types: use `infer` to extract; avoid over-nesting
- Mapped types over repetitive interface variants
- Template literal types for string pattern validation

### vercel-composition-patterns
**Trigger**: refactoring boolean prop proliferation, compound components, render props, context providers, component architecture, React 19
**Path**: `docs/.agents/skills/vercel-composition-patterns/SKILL.md`
**Compact Rules**:
- No boolean prop proliferation — use compound components or explicit variants
- React 19: no `forwardRef`; use `ref` as a regular prop
- Lift state only as high as needed; decouple implementation from interface
- Context interface pattern: expose named actions, not raw setState
- Children over render props in React 19

### vercel-react-best-practices
**Trigger**: React components, Next.js pages, data fetching, bundle optimization, performance
**Path**: `docs/.agents/skills/vercel-react-best-practices/SKILL.md`
**Compact Rules**:
- 70 rules across 8 categories (async, bundle, rendering, rerender, JS, client, advanced)
- Parallel data fetching with `Promise.all`; avoid sequential awaits
- Dynamic imports for below-fold or conditional components
- Avoid barrel imports that inflate bundle size
- Derived state in render — no `useEffect` + `setState` for derived values
- Early exit before expensive operations and awaits

---

## Project Conventions

**Source**: `docs/CLAUDE.md`, root `CLAUDE.md`

- Monorepo: pnpm workspaces — `backend-js`, `frontend-app`, `docs`, `erronkaFrontend-React`
- docs/ stack: Next.js 16.2.4, Nextra 4.6.1, React 19, Tailwind 4, Vitest 4.1.5
- i18n: 3 locales — `en` (default), `es`, `eus`; all new content must be added in all 3 locales
- Navigation: add entries to `navItems()` in `docs/app/utils/constants.ts` AND all 3 dictionaries
- Content path: `docs/content/{locale}/{section}/index.mdx`
- MDX frontmatter: always include `description` field
- Type checker: `tsc --noEmit` must pass; `strict: true` enforced
- No Zod anywhere in the stack — plain TypeScript validation
- Backend architecture: dtos/ → repository/ → service/ → route.ts (see docs/CLAUDE.md §2)
