# Milking Tracker with Music — Agent Operating Guide

## Purpose

This repository is a take-home full-stack assignment. Build a clean, working, mobile-first Milking Tracker that starts calming music during a milking session, keeps an accurate timer, saves the completed session to MongoDB, and displays real session history.

The goal is a balanced and credible submission, not a production platform. Prefer a small end-to-end feature that works reliably over extra infrastructure or speculative abstractions.

## Source of truth and rule priority

Use this order when instructions conflict:

1. `📝 Fullstack Assignment_ Milking Tracker with Music.md`
2. `BUSINESS-LOGIC.md` for confirmed user journeys, business rules, and explicitly undecided behaviour
3. This `AGENTS.md`
4. `ARCHITECTURE.md` for end-to-end system boundaries, flows, contracts, and deployment topology
5. `BACKEND-RULES.md` for the Node.js/Express application
6. `NEXTJS-RULES.md`, but only the frontend rules relevant to this project
7. Relevant local skills under `.agents/skills/`
8. `README.md` and other project documentation

When `UI-REFERENCE.md` exists, read its Approved images before frontend UI work. Use it for visual direction only; it never overrides required behaviour, accessibility, or architecture.
9. Existing code and established conventions

Important project-specific overrides:

- The backend is a separate Node.js + Express application governed by `BACKEND-RULES.md`, not Next.js Route Handlers or Server Actions.
- Keep the assignment endpoints `GET /sessions` and `POST /sessions` available exactly as specified.
- Do not add authentication, queues, workers, Redis, sockets, payments, uploads, or microservices unless the assignment scope is explicitly changed.
- Local AI/agent instructions and skills are development aids only. They must remain ignored by Git and must not be mentioned in the submitted README or commit messages.

If the assignment brief, this file, and the implementation disagree, call out the conflict before changing public behavior.

## Product scope

### Required user journey

1. The landing page presents a clear `Start Milking` action and a link to history.
2. Starting a session begins both the calming music and the visible timer.
3. Pausing pauses both music and elapsed-time accumulation.
4. Resuming continues both from the paused positions.
5. Stopping freezes the session and asks for the milk quantity collected.
6. Submitting the quantity persists the session through the Express API.
7. The history page fetches saved sessions from the backend and displays Date, Start Time, End Time, Duration, and Milk Collected in a table.

### Definition of done

- The complete journey works on a narrow mobile viewport and a desktop viewport.
- Timer and audio controls remain synchronized through start, pause, resume, and stop.
- Refreshing the history page still shows records because MongoDB is the source of truth.
- There is no hardcoded or dummy history data.
- Loading, empty, validation, and API error states are understandable.
- Backend inputs are validated and unexpected errors are handled centrally.
- Setup and deployment instructions are accurate and reproducible.
- Lint, tests, and production builds pass using the scripts actually present in each `package.json`.

## Approved stack

### Frontend

- Next.js App Router and React
- TypeScript and TSX with strict type checking
- Use `.tsx` for files that render JSX and `.ts` for non-UI modules, hooks, utilities, API clients, and shared types
- Tailwind CSS v4 with shadcn/ui primitives and the configured Base Nova style
- Motion for React, imported from `motion/react`, only where motion improves feedback or state comprehension
- Native HTML audio playback using the provided music asset
- Mobile-first styling with the smallest styling/UI dependency set that meets the design
- Native `fetch` for the two simple API operations; do not add a server-state library just for this assignment

### Backend

- A separate Node.js + Express application using MongoDB
- Plain JavaScript only; no backend TypeScript
- Follow `BACKEND-RULES.md` for all backend structure, dependencies, middleware, validation, persistence, errors, startup, shutdown, testing, and code conventions

### Tooling

- Use npm and commit the generated `package-lock.json` files.
- Use ESLint and lightweight, targeted tests.
- Add a package only when it removes real complexity or satisfies a stated requirement.

Do not copy the full dependency list from `D:\New folder\learning\production-setup`. That repository is an architecture reference; this assignment only needs its module boundaries, centralized configuration, validation, and error-handling patterns.

## Frontend session and audio rules

Timer correctness is more important than elaborate animation.

- Audio playback must begin from the user's Start click so browser autoplay policy is respected.
- Handle the promise returned by `audio.play()`. If playback fails, show a useful recovery message and do not silently pretend music is playing.
- Store timing anchors, accumulated active milliseconds, and the current state (`idle`, `running`, `paused`, `stopped`, `saving`).
- Use an interval only to refresh the display. Derive elapsed time from timestamps instead of incrementing a counter each tick, so background-tab throttling does not create drift.
- Pause both elapsed-time accumulation and audio in the same action.
- Resume both from their existing positions; do not restart the track or timer.
- Stop audio, capture `end_time`, freeze duration, and open an accessible quantity form.
- Do not save until a valid milk quantity is submitted.
- Prevent duplicate submissions while the POST request is in flight.
- On save failure, retain the stopped session and entered quantity so the user can retry.
- Reset the local session only after a successful save or an explicit cancel/reset action.
- Clean up intervals and audio on unmount. Do not let more than one timer or track run.
- If the music track ends while the session is active, loop it unless the product design explicitly says otherwise.

Use the browser for display formatting and the API for persistence. Send timestamps as UTC ISO strings; display history using the user's locale while keeping column labels and units explicit.

## Frontend UI rules

- Design mobile first, beginning around a 320 px viewport.
- Make the farmer experience feel like a focused mobile application: full height screens, consistent navigation, comfortable thumb reach, phone safe area support, and immediate interaction feedback.
- Use a floating bottom navigation bar as the main navigation on Milking and History. Include only those two top level destinations unless scope changes.
- Give each destination an icon and translated label, show the active route clearly, and ensure the bar never covers page content.
- Animate the active navigation indicator with Motion using a shared `layoutId`; keep feedback between 150 and 300 milliseconds and honour reduced motion.
- Keep interactive targets at least 44 by 44 CSS pixels. Do not make any required action hover dependent.
- On wider screens, constrain the main experience instead of turning it into a stretched dashboard.
- Mobile app like does not authorize PWA installation, offline behaviour, push notifications, or native app work.
- Design for farmers who may have limited experience with web applications. Use short, familiar wording, large touch targets, and one obvious main action at each stage.
- Support the complete farmer journey in English and Hindi. Every visible label, status, validation message, empty state, success message, and error message must use the frontend internationalization layer.
- A language change must preserve the active timer, audio position, entered quantity, and unsaved session state.
- Never rely on an icon, colour, or untranslated placeholder to explain an important action.
- Keep the landing page calm and uncluttered: one dominant primary action, the timer, essential controls, playback status, and a clear history link.
- Make Start, Pause/Resume, and Stop labels unambiguous. Never rely on color alone.
- Use semantic buttons, form labels, focus management, visible focus styles, and keyboard-operable dialogs or sheets.
- Respect `prefers-reduced-motion` and avoid distracting animations during milking.
- Check the shadcn registry before hand-building a standard accessible primitive. Keep generated components local and adapt them to the product rather than wrapping them in another generic UI layer.
- Import animation APIs from `motion/react`, never from `framer-motion`. Prefer CSS for simple hover/focus transitions and Motion for meaningful state or layout transitions.
- Animate `transform` and `opacity` where possible, keep motion short and restrained, and provide an equivalent reduced-motion experience.
- Use a readable `tabular-nums` style for the timer.
- Keep the required history in an actual table. On small screens, allow deliberate horizontal scrolling or use a responsive table treatment without dropping columns.
- Provide loading, empty, error, and retry states on history.
- Avoid a dashboard shell, sidebar, command palette, charts, complex filters, theme system, or large component library for two small screens.
- Use Server Components by default where useful, but the live milking/audio feature is necessarily a focused Client Component.
- Do not fetch history in a bare `useEffect` if a simple server fetch works with the deployment architecture. If the separate API/CORS setup makes a client fetch more appropriate, isolate it in the feature API module and implement loading and cancellation cleanly.

## Configuration and security

Frontend variables should be documented in a tracked `.env.example` file:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Rules:

- Never commit real `.env` files, secrets, credentials, or production connection strings.
- Keep the frontend API base URL configurable for local development and deployment.
- Follow `BACKEND-RULES.md` for backend environment validation, CORS, HTTP security, request validation, and secrets handling.

## General code-quality conventions

- Use `const` by default and `let` only for reassignment. Never use `var`.
- Prefer small named functions and explicit control flow over clever abstractions.
- Keep frontend TypeScript `strict` mode enabled. Do not use `any`, `@ts-ignore`, or unsafe type assertions to bypass errors.
- Define explicit types for component props, API request and response DTOs, session state, timer state, and error results.
- Keep backend API field names in their assignment-defined snake_case form within API DTOs. Map only when a separate UI model provides real value.
- Narrow `unknown` values safely, especially caught errors and external API responses.
- Comments should explain non-obvious decisions, especially timer math, not restate the code.
- Remove dead code, scaffold examples, placeholder TODOs, and debug logs before submission.
- Do not suppress lint errors to make checks pass.

### Experienced engineering quality bar

Code should look like it was written and reviewed by an experienced full stack developer. It should be production minded, easy to follow, and proportionate to a one day assignment.

- Choose the simplest design that fully handles the known requirements and realistic failure cases.
- Make the main path readable from top to bottom. Use domain names such as `createSession`, `activeDurationMs`, and `milkQuantity`, not vague names such as `handleData`, `manager`, or `helper`.
- Keep functions focused and keep related logic close together. Extract code when it has a distinct responsibility or real reuse, not merely to make more files.
- Add an abstraction only when it removes actual duplication, protects a real boundary, or makes testing materially easier.
- Handle real production concerns: invalid input, failed network requests, duplicate submissions, unavailable audio, cleanup, database failures, and safe configuration.
- Do not add speculative factories, generic base classes, plugin systems, provider layers, feature flags, or extension points for requirements that do not exist.
- Prefer one clear implementation over multiple premature strategies.
- Comments explain why a decision is non-obvious. Avoid tutorial narration, generated-looking section comments, and large JSDoc blocks for self-explanatory code.
- Avoid excessive defensive checks for impossible internal states. Validate at external boundaries, then rely on established invariants inside the application.
- Use dependencies only when they provide clear value beyond a small local implementation.
- Test critical behavior and edge cases. Do not write low-value tests that only repeat implementation details.
- Before finishing, remove dead branches, unused types, duplicated wrappers, temporary logs, placeholder copy, and needless indirection.

Use this review question: would an experienced developer keep this code after a practical code review? If not, simplify or correct it before handoff.

## Testing and validation

Testing should be proportional to the assignment.

- Backend testing rules and the minimum backend test cases are defined in `BACKEND-RULES.md`.

Frontend priority checks:

- Start triggers audio and timer from one user action
- Pause freezes both; resume continues both
- repeated pause/resume cycles preserve accurate active duration
- backgrounding the tab does not materially drift the timer
- Stop opens quantity entry and prevents invalid/double submission
- successful save appears in history; failed save can be retried
- history has correct loading, empty, error, and populated states
- controls work by keyboard and at mobile width

For every meaningful change, run the narrowest relevant checks first, then run the full lint/test/build commands before handoff. Do not claim a check passed unless it was actually executed. If a check cannot run, report the exact reason.

## Working method

1. Inspect the current tree, package scripts, relevant docs, and relevant skills before editing.
2. State the next cohesive outcome and any assumption that affects public behavior.
3. Implement one vertical slice or one tightly related fix at a time.
4. Keep diffs focused. Do not reformat or refactor unrelated files.
5. Validate the changed behavior and inspect the final diff.
6. Report what changed, which checks ran, and the next useful step.

Safe, reversible implementation details do not need repeated approval. Stop and ask before changing the approved stack, required API contract, database choice, repository layout after code exists, deployment approach, or assignment scope.

Preserve user changes in a dirty worktree. Never run destructive Git commands or overwrite unrelated work.

## Skills policy

Use the JavaScript Mastery skill workflow from the reference project without requiring the user to type slash commands.

### Automatic skill routing

For every project-related request, first classify the work and automatically invoke the smallest relevant skill set. The user does not need to say `/scope`, `/architect`, `/develop`, or another skill name.

| Request type | Required skill |
| --- | --- |
| Plan the product, next slice, or feature order | `scope` |
| Make a load-bearing technical, data, API, or UX decision | `architect` |
| Bootstrap or gap-fill repository context | `audit` |
| Build or change application code | `develop` |
| Diagnose and fix incorrect behavior | `debug` |
| Add or update automated tests | `test` |
| Verify behavior or perform pre-merge review | `check` |
| Write release notes, changelog, PR text, or postmortem | `document` |
| Reconcile durable context and scope after a material change | `sync` |

Compound work uses the relevant sequence automatically:

- New feature with undecided behavior: `scope` → `architect` → `develop` → `check` → `test` → `sync`.
- Clear, already-decided implementation: `develop` → relevant verification → `sync`.
- Bug fix: `debug` → `test` → `check` → `sync`.
- Review-only request: `check` without changing code.
- Documentation-only request: `document`; use `sync` only if durable project context changed.

Do not force every skill into every task. Automatic use means every request is routed through the suite and all relevant skills are applied, not that unrelated skills run or create artifacts. For a simple question, inspection, or status request, use the matching read-only workflow and avoid unnecessary files.

### Installed JavaScript Mastery skills

- [scope](.agents/skills/scope/SKILL.md): product scope, phases, and feature ordering
- [architect](.agents/skills/architect/SKILL.md): architecture and feature decision specifications
- [audit](.agents/skills/audit/SKILL.md): repository context bootstrap and gap filling
- [develop](.agents/skills/develop/SKILL.md): feature and application implementation
- [debug](.agents/skills/debug/SKILL.md): root-cause diagnosis and minimal fixes
- [test](.agents/skills/test/SKILL.md): targeted automated test creation
- [check](.agents/skills/check/SKILL.md): behavior verification and senior review
- [document](.agents/skills/document/SKILL.md): human-facing change documentation
- [sync](.agents/skills/sync/SKILL.md): context and scope reconciliation

### Installed frontend library skills

- [next-dev-loop](.agents/skills/next-dev-loop/SKILL.md): version-aware Next.js development and runtime verification
- [shadcn](.agents/skills/shadcn/SKILL.md): registry discovery, component installation, and composition patterns
- [motion](.agents/skills/motion/SKILL.md): Motion for React APIs, performance, and reduced-motion guidance

### Skill execution rules

- Inspect `.agents/skills/` and read the complete relevant `SKILL.md` before using that skill.
- Follow any routed reference or mode file required by that skill before acting.
- Announce the skill or skill sequence being used and why before it causes an action or pause.
- Use library-specific skills when they exist for Next.js, React, Express, Mongoose, Zod, or the selected UI tooling.
- For every Next.js code change, also read and apply `next-dev-loop`. For shadcn components, use `shadcn`; for animation work, use `motion`. These library skills complement the routed JavaScript Mastery workflow rather than replacing it.
- On this Windows environment, invoke npm-installed command shims with their `.cmd` form when PowerShell execution policy blocks the `.ps1` shim, for example `npm.cmd`, `npx.cmd`, and `agent-browser.cmd`.
- Do not invoke every installed skill on every task. Choose the smallest relevant set.
- Do not install a library merely because a skill exists for it.
- If a useful skill is missing, add it only when the current task requires it and keep it under the ignored `.agents/skills/` directory.
- Skill output never overrides the assignment brief or the scope limits in this file.
- Explicitly mention skill usage during local collaboration, but never leak agent/skill metadata into submitted source code, README content, Git history, deployment configuration, or product UI.

## Git and submission hygiene

The assignment asks for periodic commits. Keep the history easy for reviewers to follow with small milestone commits such as setup, backend sessions API, timer/audio flow, persistence integration, history UI, and final polish/tests.

- `AGENTS.md`, nested agent files, `.agents/`, skill files, prompt files, and editor-assistant configuration are local-only and must stay ignored.
- `BACKEND-RULES.md` and `NEXTJS-RULES.md` are also local-only and must stay ignored.
- `ARCHITECTURE.md` is human-facing project documentation and should be committed unless the user explicitly decides otherwise.
- Before every commit, inspect `git status` and `git diff --cached` to ensure no AI/agent metadata, secret, temporary file, or unrelated asset is staged.
- Never mention AI tools, prompts, agents, or skills in commit messages or the submission README.
- Do not add AI co-author trailers to commits.
- Commit `.env.example`, lockfiles, source, tests, music assets with valid redistribution rights, README, and deployment configuration.
- Do not commit `.env`, dependency folders, build output, coverage, logs, platform state, or local database files.
- Never change Git identity, create the private remote, push, add collaborators, deploy, or send the submission email unless the user explicitly asks.

## Scope guardrails

Required or worthwhile:

- polished two-page mobile-first flow
- accurate audio/timer state machine
- session validation and MongoDB persistence
- central backend errors and configuration
- a few high-value tests
- clear setup/deployment README
- accessible UI and honest failure states

Out of scope unless requested:

- accounts or authentication
- multiple farms, cattle profiles, teams, or roles
- playlists, streaming services, or music uploads
- analytics dashboards or milk-yield predictions
- notifications, offline synchronization, PWA installation, or background audio
- Redis, jobs, queues, workers, WebSockets, SSE, or event buses
- Docker, Kubernetes, Terraform, or a microservice split
- admin panels, audit logs, observability stacks, or elaborate logging
- premature caching, pagination, state-management frameworks, or design systems

When tempted to add an extra feature, first finish and validate the required journey.

## Final handoff checklist

- [ ] Landing page has Start Milking and History navigation.
- [ ] Start, Pause, Resume, and Stop synchronize audio and timer.
- [ ] Quantity is validated and saved only after Stop.
- [ ] `POST /sessions` and `GET /sessions` match the assignment.
- [ ] MongoDB data survives refresh/restart.
- [ ] History uses backend data and includes every required column.
- [ ] Mobile, desktop, keyboard, loading, empty, and error states were checked.
- [ ] Backend validation and error handling were tested.
- [ ] Real music assets are licensed/provided and tracked; no broken placeholders remain.
- [ ] `.env.example` and README commands are correct.
- [ ] Lint, tests, and production builds pass.
- [ ] No secrets, AI metadata, agent files, skills, build output, or debug artifacts are staged.
- [ ] Deployment links and repository access are verified only when the user requests submission work.
