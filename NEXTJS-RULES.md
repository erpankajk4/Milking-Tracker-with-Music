# Next.js Frontend Rules

These rules apply only to `frontend/`. The Express application owns the API,
validation, business logic, and MongoDB access.

## Scope and stack

- Use the current Next.js App Router setup with React and strict TypeScript.
- Use Tailwind CSS v4 for styling, shadcn/ui for standard accessible primitives,
  and Motion for React for purposeful animation.
- Keep the assignment to the milking screen and session history. Do not add
  authentication, dashboards, command palettes, themes, charts, uploads, or
  other product features unless requested.
- Do not add Route Handlers, Server Actions, database clients, or backend
  business logic. Call the separate Express API through its configured base URL.
- Use native `fetch`; the two assignment endpoints do not justify a data library.
- Support all farmer facing screens and states in English and Hindi through one
  frontend internationalization layer. Do not scatter translated strings across
  components.

## Skill routing

The JavaScript Mastery workflow in the root `AGENTS.md` applies automatically.
Frontend work also loads the smallest relevant library skill:

- Read `.agents/skills/next-dev-loop/SKILL.md` before changing Next.js code.
- Read `.agents/skills/shadcn/SKILL.md` before discovering, adding, or changing
  shadcn components.
- Read `.agents/skills/motion/SKILL.md` before adding or changing animation.
- On this Windows machine, use `npm.cmd`, `npx.cmd`, and `agent-browser.cmd`
  when PowerShell blocks package-generated `.ps1` command shims.

Use the versioned Next.js documentation bundled in
`frontend/node_modules/next/dist/docs/` when behavior may have changed.

## App Router boundaries

- Keep pages and layouts as Server Components unless browser APIs, events, or
  live state require a Client Component.
- Put `"use client"` on the narrowest practical boundary. The timer/audio
  controller is client-side; surrounding page content should remain server-side.
- Use route-level `loading.tsx`, `error.tsx`, and `not-found.tsx` only where they
  represent a real route state.
- Fetch history from the Express API with caching disabled so it always reflects
  MongoDB. Centralize URL creation and response parsing in the feature API module.
- Await request-time APIs such as `params`, `searchParams`, `cookies()`, and
  `headers()` when they are used in current Next.js versions.

## TypeScript and React

- Keep `strict` enabled and `allowJs` disabled.
- Use `.tsx` only for JSX and `.ts` for types, utilities, API clients, and hooks.
- Do not use `any`, `@ts-ignore`, non-null assertions, or casts to hide errors.
  Validate or narrow values at external boundaries.
- Model the milking workflow with a discriminated state union rather than a set
  of unrelated booleans.
- Prefer clear local state and focused hooks. Do not add a global state library
  for this assignment.
- Avoid premature `useMemo`, `useCallback`, and `React.memo`. Add them only for a
  demonstrated identity or performance requirement.
- Keep effects for external synchronization. Derive values during render when
  no external system is involved.

## shadcn/ui

- Search the configured shadcn registry before implementing a common primitive.
- Add components with the project-local CLI and review every generated file.
- Treat generated components as owned source: simplify or adapt them when the
  assignment needs less, while preserving accessibility.
- Compose primitives directly in feature components. Do not create a second
  generic wrapper layer without repeated product-level use.
- Use semantic HTML when no component is needed. A styled `div` is not a button.
- Preserve labels, focus visibility, keyboard behavior, and ARIA supplied by the
  primitive. Use a dialog only when modal behavior is genuinely required.

## Motion

- Import from `motion/react`; do not install or import `framer-motion` alongside
  `motion`.
- Use CSS transitions for simple color, shadow, hover, and focus feedback.
- Use Motion for meaningful state changes such as the quantity panel appearing,
  save feedback, or a compact layout transition.
- Prefer `transform` and `opacity`. Avoid animating layout-heavy properties in
  the active timer path.
- Respect reduced-motion preferences with `useReducedMotion` or an equivalent
  CSS media query. Reduced motion must preserve meaning and usability.
- Keep animations short and calm. Do not animate the timer digits on every tick.

## Timer and audio

- Begin audio from the Start user gesture and handle the `audio.play()` promise.
- Use one `HTMLAudioElement`; pause and resume from the existing playback point.
- Derive elapsed time from timestamps and `performance.now()`. An interval may
  refresh the display but must not be the clock.
- Pause, resume, and stop timer/audio in one coherent transition.
- Clean up intervals and audio on unmount. Never allow duplicate timers, tracks,
  or save requests.
- Preserve stopped-session data and quantity after a failed save so retry works.

## UI and accessibility

- Design mobile-first from 320 px and verify a desktop layout as well.
- Build a focused, full height mobile experience rather than a desktop page that
  is merely narrowed. Respect safe area insets around persistent controls.
- Use a floating bottom navigation bar for the two top level routes, Milking and
  History. Use semantic links with an icon and translated text label for each.
- Keep the bottom bar above `env(safe-area-inset-bottom)` and reserve enough page
  padding that it never covers controls, forms, or table content.
- Animate the active route indicator with Motion and a shared `layoutId`. Keep
  press and indicator feedback between 150 and 300 milliseconds, with no bounce
  or continuous decorative motion.
- Put `MotionConfig reducedMotion="user"` near the client application boundary.
  Reduced motion must retain a clear active route without moving the indicator.
- Keep interactive targets at least 44 by 44 CSS pixels and place primary session
  actions within comfortable thumb reach.
- Provide clear pressed, disabled, loading, success, and error feedback. No
  required interaction may depend on hover.
- Keep navigation and back behaviour consistent. On larger screens, constrain
  the content width instead of expanding into a dashboard.
- Mobile app like does not add PWA, offline, push notification, or native mobile
  application scope.
- Design for farmers with different levels of digital experience. Prefer short,
  familiar labels, large touch targets, and one obvious main action at a time.
- Translate navigation, controls, status text, field guidance, history headings,
  and loading, empty, success, validation, and error states into English and Hindi.
- Keep session state separate from language state. Changing language must not
  reset the timer, audio, quantity form, or unsaved session.
- Do not rely on colour, icons, or an English placeholder alone to communicate
  an important action.
- Keep one dominant action on the milking screen and make all control labels
  explicit. Do not rely on color alone.
- Use a tabular-number style for the timer and keep live announcements polite.
- Focus the quantity field when the stop flow opens, and return focus sensibly
  when it closes.
- Keep history as a real table with every required column. Use intentional
  horizontal scrolling on narrow screens if necessary.
- Provide honest loading, empty, validation, API-error, retry, and success states.

## Structure

Prefer this small feature-oriented shape:

```text
src/
  app/
    history/
    layout.tsx
    page.tsx
  components/ui/
  features/milking/
    components/
    hooks/
    milking.api.ts
    milking.types.ts
    milking.utils.ts
  lib/
```

Add a file or abstraction only when it owns a distinct responsibility or removes
real duplication. Keep code readable and proportionate to the assignment.

## Required checks

Run from `frontend/` after meaningful frontend changes:

```bash
npm run lint
npm run typecheck
npm run build
```

For interactive changes, also verify the real page in a browser at mobile and
desktop widths. Check keyboard use, reduced motion, audio failure, background-tab
timer accuracy, failed save retry, and history states when relevant.
