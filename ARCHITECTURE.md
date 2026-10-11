# Milking Tracker with Music — End-to-End Architecture

## 1. Purpose

This document defines the complete architecture for the Milking Tracker assignment: frontend, audio/timer behavior, backend, MongoDB persistence, API integration, and deployment.

The design is intentionally small enough to complete and explain as a take-home assignment while retaining clear module boundaries and reliable behavior.

## 2. Architectural goals

- Deliver the required Start, Pause, Resume, Stop, Save, and History journey.
- Use strict TypeScript throughout the Next.js application while keeping the Node.js backend in plain JavaScript.
- Keep the timer accurate even when browser intervals are throttled.
- Keep music and session state synchronized.
- Persist every submitted session through the backend; never use dummy history.
- Make the frontend and backend independently deployable.
- Use a modular-monolith backend without unnecessary infrastructure.
- Keep the code straightforward for an evaluator to run and review.
- Keep the farmer interface simple for users with limited technical experience.
- Support the complete user journey in English and Hindi.
- Apply production basics where they reduce real risk, while avoiding abstractions and infrastructure for hypothetical future requirements.

## 3. System context

```text
Farmer
  |
  v
Next.js web application
  |-- serves the mobile-first UI
  |-- serves the bundled calming audio asset
  |-- owns live timer/audio state in the browser
  |
  | HTTPS JSON
  v
Node.js + Express API
  |-- validates requests
  |-- applies session business rules
  |-- reads/writes session records
  |
  | Mongoose
  v
MongoDB
```

The audio file is a frontend asset. It is not uploaded to, streamed by, or stored in the backend or MongoDB.

## 4. Deployment topology

The application has three deployable/runtime parts:

| Part | Recommended host | Responsibility |
| --- | --- | --- |
| Frontend | Vercel or Netlify | Next.js pages, client session controls, static music asset |
| Backend | Render or Railway | Express API and MongoDB integration |
| Database | MongoDB Atlas | Durable milking-session records |

Local defaults:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5000
MongoDB:  mongodb://127.0.0.1:27017/milking_tracker
```

The backend permits only the configured frontend origin for browser requests. Server-to-server requests without an `Origin` header remain valid for health checks and server-rendered history fetching.

## 5. Repository topology

```text
milking-tracker-with-music/
  frontend/
    public/
      audio/
        calming-music.*
    src/
      app/
        history/
          error.tsx
          loading.tsx
          page.tsx
        layout.tsx
        page.tsx
      features/
        milking/
          components/
          hooks/
          milking.api.ts
          milking.types.ts
          milking.utils.ts
      components/
    .env.example
    package.json
    tsconfig.json

  backend/
    src/
      config/
      middlewares/
      modules/
        health/
        sessions/
      routes/
      shared/
      app.js
      server.js
    tests/
    .env.example
    package.json

  ARCHITECTURE.md
  README.md
  .gitignore
```

The repository is not a runtime monorepo and does not require workspace tooling. Each application owns its dependencies, scripts, environment variables, and deployment root.

## 6. Frontend architecture

The frontend uses Next.js App Router, strict TypeScript, Tailwind CSS v4, shadcn/ui, and Motion for React. React components use `.tsx`; hooks, API clients, utilities, and shared models use `.ts`. Public API DTOs explicitly retain `start_time`, `end_time`, and `milk_quantity` so the frontend contract matches the Express API without implicit renaming.

shadcn/ui supplies accessible primitives that are kept in the repository and adapted to the product. Motion is reserved for short, purposeful state and layout transitions; ordinary hover and focus feedback stays in CSS. Animations respect reduced-motion preferences and must not distract from the active milking timer.

### Farmer friendly interface and languages

- Keep the journey linear, with one obvious main action at each stage.
- Use large touch targets, short labels, visible status text, and familiar wording.
- Do not rely on colour or icons alone to explain Start, Pause, Resume, Stop, or Save.
- Provide every farmer facing message in English and Hindi, including validation, loading, empty, success, and error states.
- Keep translations in one frontend internationalization layer rather than placing translated strings throughout components.
- Treat language as presentation only. API field names and MongoDB session records remain language neutral.
- Changing language must preserve the current timer, audio position, form values, and unsaved session state.
- Start in Hindi, remember the selected language in browser storage, and keep language out of the URL.
- Format dates, times, and numbers with `en-IN` or `hi-IN` in the viewer's device timezone.

Language changes affect presentation only and must not trigger route changes or API writes.

### Mobile app like web experience

- Use a focused, full height mobile layout rather than a desktop dashboard reduced to phone width.
- Keep primary controls large and within comfortable thumb reach, with at least a 44 by 44 CSS pixel interactive area.
- Respect phone safe area insets around persistent headers, navigation, and bottom controls.
- Provide visible pressed, disabled, loading, success, and error feedback. Do not depend on hover interactions.
- Keep navigation and back behaviour consistent across the milking and history screens.
- Constrain the content width on larger screens so the experience stays focused.
- Keep the required history as a semantic table. On narrow screens, contain deliberate horizontal scrolling within the table region.
- Use short, restrained motion to clarify state changes, while preserving the same meaning when reduced motion is enabled.

This remains a responsive web application. PWA installation, offline support, push notifications, and native mobile applications are outside the current requirement unless requested separately.

### Floating bottom navigation

- Use one floating bottom navigation surface on the Milking and History screens.
- Provide exactly the two current top level destinations: Milking and History.
- Use semantic Next.js links with both an icon and a translated text label.
- Show the active route with a high contrast rounded indicator. Colour alone must not be the only active cue.
- Use Motion for React with a shared `layoutId` for the active indicator and a small press response for each item.
- Keep navigation feedback between 150 and 300 milliseconds. Avoid decorative bouncing or continuous movement.
- Place the navigation above `env(safe-area-inset-bottom)` and add enough page padding so it never covers content.
- Configure `MotionConfig reducedMotion="user"` near the client application boundary. Reduced motion keeps clear colour or opacity feedback without moving the indicator.
- Keep the navigation usable by touch, keyboard, and screen reader.

Show normal Milking and History navigation only while the session is idle. While a session is running, paused, awaiting quantity, or saving, replace it with the relevant session controls. Restore normal navigation after save or confirmed discard.

### Pages

`/` is the primary milking experience:

- initial Start Milking action
- large live timer
- music playback status
- Pause/Resume and Stop controls
- milk-quantity entry after stopping
- save success or retryable error feedback
- navigation to History

`/history` displays persisted sessions:

- Date
- Start Time
- End Time
- Duration
- Milk Collected
- loading, empty, failure, and retry behavior
- navigation back to the milking screen

### Rendering boundaries

- Keep layouts and static page content as Server Components.
- Implement the live timer/audio controls as one focused Client Component because it requires browser audio, refs, events, and live state.
- Fetch history in the History Server Component using `cache: "no-store"` so records always come from the backend.
- Use route-level `loading.tsx` and `error.tsx` for the History experience.
- Keep API URL construction in `milking.api.ts`; do not scatter environment-variable access across components.
- Keep reusable types in `milking.types.ts`, including the session DTO, create-session input, state union, and API error shape.
- Keep TypeScript `strict` mode enabled and narrow external `unknown` values rather than bypassing errors with `any`.

### Audio ownership

The browser owns playback through a single `HTMLAudioElement`:

- Start calls `audio.play()` directly from the user gesture.
- Pause calls `audio.pause()`.
- Resume calls `audio.play()` from the existing playback position.
- Stop pauses audio and restores its position for the next new session.
- The audio loops while the session remains active.
- Component cleanup pauses audio and releases timers.

An audio failure is visible to the user. The timer remains the source of truth and continues, but the UI must not claim music is playing. Show a translated `Retry Music` action that calls `audio.play()` from the farmer's new button tap.

## 7. Milking-session state model

Use an explicit state model rather than independent booleans:

```text
idle
  | Start
  v
running <-----------------+
  | Pause                 | Resume
  v                       |
paused -------------------+
  |
  | Stop (also allowed from running)
  v
awaiting_quantity
  | Submit valid quantity
  v
saving
  | success              | failure
  v                      v
saved/idle        awaiting_quantity

awaiting_quantity
  | Confirm discard
  v
idle
```

State responsibilities:

| State | Timer | Audio | Allowed primary action |
| --- | --- | --- | --- |
| `idle` | zero | stopped | Start |
| `running` | advancing | playing or recoverable failure | Pause or Stop |
| `paused` | frozen | paused | Resume or Stop |
| `awaiting_quantity` | frozen | stopped | Submit quantity |
| `saving` | frozen | stopped | wait; duplicate submit disabled |

Do not allow multiple timers, simultaneous tracks, Stop twice, or duplicate POST requests.

## 8. Timer model

The displayed timer must derive elapsed time from timestamps rather than incrementing a counter.

Client state:

```text
sessionStartedAt       wall-clock Date captured once on Start
activeSegmentStartedAt high-resolution timestamp for the current running segment
accumulatedActiveMs    sum of completed running segments
sessionEndedAt         wall-clock Date captured once on Stop
```

While running:

```text
elapsedMs = accumulatedActiveMs + (performance.now() - activeSegmentStartedAt)
```

On Pause or Stop:

```text
accumulatedActiveMs += performance.now() - activeSegmentStartedAt
```

The interval only requests a visual refresh. It is not the source of elapsed time. This avoids material drift when the tab is backgrounded or the browser delays callbacks.

Persisted `duration` is `floor(accumulatedActiveMs / 1000)` in whole seconds and excludes paused time. `start_time` and `end_time` remain wall-clock UTC timestamps and therefore include pauses between them.

## 9. End-to-end request flows

### Start, pause, and resume

1. The farmer selects Start Milking.
2. The client captures `start_time` and the first active timing anchor.
3. The client attempts audio playback.
4. The UI enters `running`; if playback fails, the timer continues and the UI exposes `Retry Music`.
5. Pause accumulates the active segment and pauses audio.
6. Resume creates a new active timing anchor and continues audio.

No backend request is needed while a session is active.

### Stop and save

1. Stop finalizes the current active timing segment.
2. The client captures `end_time`, freezes `duration`, and stops audio.
3. The UI enters `awaiting_quantity` and focuses the quantity input.
4. The farmer enters litres collected.
5. The frontend validates basic input and sends `POST /sessions`.
6. The backend validates the complete request independently.
7. The service applies cross-field rules.
8. The repository inserts one MongoDB document.
9. The API returns the normalized stored record with `id`.
10. The client shows success and resets for the next session.

Closing the quantity surface keeps the stopped session pending. The farmer may return to it or choose an explicit, confirmed Discard Session action.

If saving fails, the stopped session and entered quantity remain available for retry.

### View history

1. The farmer opens `/history`.
2. Next.js requests `GET /sessions` from the Express API with caching disabled.
3. The sessions repository queries MongoDB newest first.
4. The API returns a JSON array.
5. The page formats UTC timestamps in the viewer's locale and displays all required columns.

An empty database produces an honest empty state, never sample records.

## 10. Backend architecture

The backend is one modular monolith. `BACKEND-RULES.md` defines its detailed implementation conventions.

Runtime flow:

```text
HTTP request
  -> Express security/body middleware
  -> route
  -> Zod validation middleware
  -> controller
  -> service
  -> repository
  -> Mongoose model
  -> MongoDB
```

The `sessions` module owns all milking-session behavior. The `health` module is operational only. Shared code is limited to genuine cross-cutting utilities such as `AppError`, async error forwarding, response helpers, and logging.

`app.js` composes Express without listening. `server.js` validates startup, connects MongoDB, opens the listener, and owns graceful shutdown.

## 11. Public API contract

### `POST /sessions`

Request:

```json
{
  "start_time": "2025-03-10T14:00:00.000Z",
  "end_time": "2025-03-10T14:15:00.000Z",
  "duration": 900,
  "milk_quantity": 5.2
}
```

Success: HTTP `201` with the stored session object.

Validation rules:

- reject unknown properties
- valid ISO 8601 timestamps
- `end_time > start_time`
- non-negative whole-second duration
- duration cannot materially exceed wall-clock elapsed time
- finite milk quantity greater than zero

### `GET /sessions`

Success: HTTP `200` with a JSON array ordered by newest `start_time` first.

```json
[
  {
    "id": "67cecd0a764df0e504c45678",
    "start_time": "2025-03-10T14:00:00.000Z",
    "end_time": "2025-03-10T14:15:00.000Z",
    "duration": 900,
    "milk_quantity": 5.2,
    "createdAt": "2025-03-10T14:16:00.000Z",
    "updatedAt": "2025-03-10T14:16:00.000Z"
  }
]
```

### `GET /health`

Success: HTTP `200` with `{ "status": "ok" }` for hosting health checks.

### Errors

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```

Public error responses never expose stack traces, raw MongoDB errors, credentials, or internal paths.

## 12. Persistence model

Collection: `milking_sessions`

| Field | BSON type | Required | Meaning |
| --- | --- | --- | --- |
| `_id` | ObjectId | yes | Internal MongoDB identity; serialized as `id` |
| `start_time` | Date | yes | Wall-clock session start in UTC |
| `end_time` | Date | yes | Wall-clock stop time in UTC |
| `duration` | Number | yes | Active milking seconds, excluding pauses |
| `milk_quantity` | Number | yes | Litres collected |
| `createdAt` | Date | yes | Mongoose creation timestamp |
| `updatedAt` | Date | yes | Mongoose update timestamp |

Index:

```text
{ start_time: -1, _id: -1 }
```

The model does not include users, farms, cattle, playlists, status history, soft deletion, or analytics fields.

## 13. Configuration contract

Frontend:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Backend:

```dotenv
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/milking_tracker
CLIENT_ORIGIN=http://localhost:3000
```

Real environment files remain local. Each application provides a tracked `.env.example`.

## 14. Failure behavior

| Failure | Expected behavior |
| --- | --- |
| Audio playback rejected | Keep the timer running, show that music is unavailable, and offer Retry Music |
| Audio asset unavailable | Do not silently claim music is playing |
| Invalid milk quantity | Keep the quantity form open with field guidance |
| API unavailable during save | Preserve stopped session data and offer retry |
| MongoDB unavailable at startup | Backend fails startup rather than serving broken requests |
| MongoDB fails during request | API returns generic `500`; details remain server-side |
| History API fails | History error boundary shows retry/navigation options |
| No saved sessions | Show an empty state with a Start Milking action |

## 15. Security and privacy boundary

- The app has no authentication or sensitive account data.
- The API validates every request regardless of frontend validation.
- Helmet sets baseline security headers.
- CORS restricts browser access to configured frontend origins.
- JSON bodies use a small size limit.
- Secrets and connection strings come from validated environment variables.
- Production errors do not reveal internals.
- Logs do not include environment values, database credentials, or full request bodies.
- The selected music asset must be provided or licensed for redistribution.

## 16. Verification strategy

### Backend

- schema validation tests for all request edge cases
- service tests for cross-field rules and repository failures
- API integration tests for health, create, history ordering, not-found, and error shape

### Frontend

- timer utility tests for active/paused duration
- component tests for state transitions where practical
- manual browser verification of audio, background-tab timing, keyboard use, and mobile layout

### End to end

Verify this real path against MongoDB:

```text
Start -> wait -> Pause -> wait -> Resume -> Stop
-> enter quantity -> Save -> open History -> confirm persisted values
```

## 17. Explicit architectural non-goals

- authentication and multi-user tenancy
- offline/PWA synchronization
- music streaming, playlists, or uploads
- real-time server communication
- queues, workers, scheduled jobs, or Redis
- analytics and reporting dashboards
- microservices or a shared monorepo framework
- caching layers or premature pagination
- container orchestration or infrastructure as code

These boundaries keep the solution credible for the assignment's one-day expectation.

## 18. Decision summary

| Decision | Reason |
| --- | --- |
| Separate Next.js and Express applications | Matches the assignment and makes each side independently deployable |
| Strict TypeScript frontend | Gives reliable component, state-machine, timer, and API-contract checks in Next.js |
| Tailwind CSS v4 + shadcn/ui | Provides a small, editable accessible UI foundation without adopting a large opaque component framework |
| Motion for React | Supports deliberate state transitions while CSS remains the default for simple interaction feedback |
| English and Hindi interface | Makes the complete farmer journey understandable in either supported language without changing stored business data |
| Mobile app like responsive UI | Gives farmers a focused, touch friendly phone experience without adding native app or PWA scope |
| Floating animated bottom navigation | Gives direct access to Milking and History with clear, touch friendly route feedback |
| JavaScript-only backend | Explicit project requirement; avoids unnecessary compilation |
| Modular-monolith backend | Clear responsibilities without distributed-system overhead |
| MongoDB + Mongoose | Required database choice with simple document persistence |
| Timestamp-derived timer | Prevents interval drift and survives browser throttling |
| Browser-owned audio | Playback requires a user gesture and does not need backend streaming |
| Server-fetched history with no cache | Uses real backend data and keeps initial history rendering simple |
| Direct `/sessions` endpoints | Preserves the evaluator-facing assignment contract |
| No authentication | Not required and would add unrelated scope |
| Pragmatic production quality | Keeps validation, failure handling, type safety, accessibility, and tests without enterprise ceremony |
