# Backend Node.js Engineering Rules

## 1. Purpose and applicability

These rules apply to the standalone `backend/` application for the Milking Tracker assignment. The architecture takes its practical conventions from `D:\New folder\learning\production-setup`, scaled down to the assignment's actual needs.

The backend is a modular monolith: one Node.js process and one MongoDB database, with code grouped by business module and separated into clear HTTP, business, and persistence layers.

The assignment brief remains the product source of truth. `ARCHITECTURE.md` owns end-to-end boundaries and contracts; this file owns backend implementation conventions. Do not add production infrastructure merely because it exists in the reference project.

### Quality calibration

Write backend code as an experienced Node.js developer would for a small production service:

- Keep the request path explicit and easy to trace.
- Include the production basics that matter here: validated configuration, input validation, safe errors, database readiness, graceful shutdown, and focused tests.
- Use the module layers consistently, but do not create an interface, class, factory, or wrapper for every file.
- Keep one concrete Mongoose repository. Do not build a generic data access framework or interchangeable database providers.
- Use one `AppError`, one async handler, and one global error middleware rather than repeated error plumbing.
- Prefer direct Mongoose queries and clear service functions over generic query builders.
- Avoid verbose JSDoc, tutorial comments, speculative options, and copied infrastructure from the reference backend.
- Treat code that is easy to remove, review, and debug as more valuable than code designed for hypothetical future scale.

## 2. Runtime and language

- Use Node.js 20 or newer.
- Use Express as the HTTP framework.
- Use MongoDB through Mongoose.
- Use plain JavaScript only.
- Set `"type": "module"` in `backend/package.json` and use ESM imports and exports.
- Include the `.js` extension in every relative backend import.
- Do not add TypeScript, `.ts` files, `tsconfig.json`, `tsx`, `ts-node`, declaration files, decorators, or a transpilation step.
- Do not copy TypeScript-like syntax into JSDoc or JavaScript source to simulate a TypeScript codebase.
- Use npm and commit `package-lock.json`.

Suggested minimal runtime dependencies:

- `express`
- `mongoose`
- `zod`
- `dotenv`
- `cors`
- `helmet`

Testing and lint dependencies may be added when used. Do not copy unrelated dependencies from the reference project.

## 3. Scope boundaries

The backend must support:

- `GET /health`
- `POST /sessions`
- `GET /sessions`
- MongoDB persistence
- validation, error handling, CORS, security headers, and graceful shutdown

The backend does not need:

- authentication, users, roles, cookies, JWT, or CSRF
- Redis, BullMQ, workers, cron jobs, events, SSE, or WebSockets
- file uploads, object storage, email, or webhooks
- an admin dashboard or metrics stack
- microservices, a message bus, or distributed tracing
- Docker unless the user explicitly chooses it for local/deployment convenience

## 4. Required backend structure

Use this structure as code is introduced:

```text
backend/
  src/
    config/
      env.config.js
      database.config.js
      cors.config.js
    middlewares/
      errorHandler.middleware.js
      notFound.middleware.js
      validate.middleware.js
    modules/
      health/
        health.router.js
        index.js
      sessions/
        session.model.js
        session.schema.js
        session.repository.js
        session.service.js
        session.controller.js
        session.router.js
        index.js
    routes/
      index.js
    shared/
      errors/
        AppError.js
      http/
        apiResponse.js
      logger/
        logger.js
      utils/
        asyncHandler.js
    app.js
    server.js
  tests/
  .env.example
  package.json
```

Do not create empty placeholder layers. A file should exist only when it owns behavior.

## 5. Dependency direction

Every business request follows this direction:

```text
router -> validation middleware -> controller -> service -> repository -> model
```

Dependencies must not point backward.

### Router

- Declares the route path and HTTP method.
- Applies validation middleware.
- Calls one controller handler.
- Contains no business rules, Mongoose calls, or response-building logic.

### Controller

- Reads validated `req.body`, `req.params`, or `req.query` values.
- Passes plain values or plain objects to a service.
- Selects the HTTP status and successful response shape.
- Does not query Mongoose or implement domain decisions.
- Must be thin enough to understand at a glance.

### Service

- Owns business validation and orchestration.
- Accepts and returns framework-independent values.
- Must not import Express or receive `req`, `res`, or `next`.
- Calls repositories rather than Mongoose models.
- Throws operational `AppError` instances for expected failures.

### Repository

- Owns all Mongoose reads and writes for the module.
- Returns documents or plain records to the service.
- Contains query concerns such as projection, sorting, and `lean()`.
- Contains no HTTP status codes, Express objects, or UI formatting.

### Model

- Defines MongoDB field types, required fields, schema-level constraints, timestamps, indexes, and serialization.
- Contains persistence invariants only; request validation remains in Zod schemas.
- Must not call services, repositories, or controllers.

### Module index

- Exports only the module's intended public entry point, normally its router.
- Other modules must not reach into a module's model or repository.

## 6. Application composition

Keep application construction separate from process startup.

### `app.js`

`app.js` must:

1. Create the Express application.
2. Disable or configure identifying defaults where appropriate.
3. Apply `helmet`.
4. Apply configured CORS.
5. Apply `express.json()` with a small explicit body limit.
6. Mount operational and business routes.
7. Mount the not-found middleware after all routes.
8. Mount the global error middleware last.
9. Export the configured app without opening a network port.

This separation allows API tests to import the app without starting a real listener.

### `server.js`

`server.js` is the process entry point. It must:

1. Load and validate environment configuration before importing code that needs it.
2. Connect to MongoDB before accepting traffic.
3. Create the HTTP server from the Express app.
4. Listen on the validated port.
5. Register idempotent `SIGINT` and `SIGTERM` shutdown handlers.
6. Stop accepting new requests, close MongoDB, and exit cleanly.
7. Apply a short forced-shutdown timeout so a broken cleanup cannot hang forever.
8. Log and exit non-zero when bootstrap fails.

Only the entry point may decide to terminate the process. A controller, service, repository, middleware, or database helper must never call `process.exit()`.

## 7. Environment configuration

Use `dotenv/config` and validate environment variables once with Zod in `env.config.js`.

Required configuration:

```dotenv
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/milking_tracker
CLIENT_ORIGIN=http://localhost:3000
```

Rules:

- Export one parsed, immutable `env` object.
- Application modules import `env`; they do not read `process.env` directly.
- `NODE_ENV` must allow only `development`, `test`, or `production`.
- Coerce and validate `PORT` as a positive integer.
- Validate that `MONGO_URI` starts with `mongodb://` or `mongodb+srv://`.
- Validate one or more allowed client origins. Split comma-separated origins in `cors.config.js` when multiple origins are needed.
- Fail fast with a concise list of invalid variables before the server starts.
- Commit `.env.example` with safe examples. Never commit a real `.env` file.
- Do not provide a production database default.

## 8. MongoDB and Mongoose

### Connection

- Keep connection code in `database.config.js`.
- Register connection logging once, not in feature modules.
- Await `mongoose.connect()` before `server.listen()`.
- Use conservative server-selection and connection timeouts.
- A small bounded startup retry is acceptable, but retries must end with a clear failure.
- Export a disconnect function for graceful shutdown and tests.
- Enable global update validators if update methods are introduced.

### Session model

Use the `milking_sessions` collection with these fields:

```text
start_time      Date    required
end_time        Date    required
duration        Number  required, integer, min 0
milk_quantity   Number  required, finite, greater than 0
createdAt       Date    generated by timestamps
updatedAt       Date    generated by timestamps
```

Model rules:

- Enable `{ timestamps: true }`.
- Add an index supporting newest-first history, such as `{ start_time: -1, _id: -1 }`.
- Configure JSON serialization so `_id` becomes `id` and `__v` is removed.
- Ensure repository results follow the same public shape when using `lean()` because schema transforms do not run on lean objects.
- Do not store formatted date strings; store actual BSON dates.
- Do not store derived display labels.
- Do not add user, farm, cattle, playlist, status, soft-delete, or audit fields without a requirement.

### Queries

- `GET /sessions` must sort by `start_time` descending with a deterministic secondary sort.
- Select only fields needed by the API.
- Avoid unbounded abstractions and aggregation pipelines for this small collection.
- Do not add transactions to a single-document create operation.

## 9. Request validation

Validate request data with Zod before it reaches a controller.

The reusable validation middleware may support `body`, `params`, and `query`, but implement only what current routes use.

For `POST /sessions`:

- Use a strict object schema so unknown fields are rejected.
- Require valid ISO 8601 strings for `start_time` and `end_time`.
- Require `end_time > start_time`.
- Require `duration` to be a non-negative integer number of seconds.
- Require `milk_quantity` to be a finite number greater than zero.
- Confirm duration does not exceed wall-clock elapsed time beyond a small rounding tolerance.
- Convert dates deliberately in the service or repository; do not rely on accidental Mongoose coercion at the API boundary.

Validation middleware must:

- replace request values with parsed values only after successful parsing
- map Zod issues to stable `{ field, message }` details
- forward one operational validation error to the global error handler
- never send a second response or swallow unknown errors

Mongoose validation remains a final persistence safeguard, not the public request-validation strategy.

## 10. API response contract

The assignment's public response examples take precedence over the generic response wrapper used in the reference backend.

### Success

- `POST /sessions` returns `201` and the newly stored session object.
- `GET /sessions` returns `200` and a JSON array of session objects.
- `GET /health` returns `200` with a small object such as `{ "status": "ok" }`.
- Public records use `id`, not `_id`, and never expose `__v`.
- Dates are serialized as UTC ISO 8601 strings.

Do not wrap the session list inside `{ success, data }` unless the assignment contract is deliberately changed. A shared success helper may be used only when it preserves the endpoint's required shape.

### Errors

All errors use one JSON shape:

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

Use stable machine-readable codes. Do not make clients parse message text.

Recommended status mapping:

- `400` malformed JSON or invalid request syntax
- `404` unknown route
- `422` valid JSON with invalid session data
- `500` unexpected server or database failure

## 11. Error handling

Use the reference project's operational-error pattern in a smaller form.

### `AppError`

An `AppError` should carry:

- `message`
- `statusCode`
- stable `code`
- optional `details`
- `isOperational = true`

### `asyncHandler`

- Wrap async Express controllers once and forward rejected promises to `next`.
- Do not put repetitive `try/catch` blocks in every controller.
- Catch an error locally only when adding context, translating it, or recovering from it.

### Global handler

The error middleware must:

- use the four-argument Express signature
- translate known Zod, Mongoose validation, cast, duplicate-key, malformed JSON, and payload-size failures when relevant
- preserve safe operational error messages
- log unexpected errors with their stack server-side
- return a generic message for unexpected production failures
- include stack traces only in development
- avoid leaking MongoDB connection details, queries, filesystem paths, or environment values

The not-found middleware must run after routes and forward an `AppError`; it should not bypass the global handler.

## 12. CORS and HTTP security

- Apply `helmet()` before business routes.
- Configure CORS from validated `CLIENT_ORIGIN`; do not use `origin: "*"` in production.
- Allow requests without an `Origin` header for tools and server-to-server health checks.
- This assignment has no cookie authentication, so keep `credentials` disabled.
- Allow only the methods and headers currently required: `GET`, `POST`, `OPTIONS`, and `Content-Type`.
- Parse JSON with a small limit such as `10kb` or `20kb`.
- Reject malformed JSON through the central error handler.
- Do not add CSRF, JWT, session middleware, or cookie parsing without authentication requirements.
- Do not add a rate-limiter dependency by default for this tiny submission. Add it only if deployment requirements justify it.

## 13. Logging

Provide a small shared logger interface with `info`, `warn`, and `error` methods so feature code does not scatter raw `console.log` calls.

- Log startup, successful database connection, shutdown, and unexpected failures.
- Do not log every successful request body or milk quantity.
- Do not log environment variables or MongoDB credentials.
- Prefer concise human-readable development logs and platform-captured console output in production.
- Do not add file rotation or Winston solely to imitate the reference project; hosted Node platforms already capture stdout/stderr.
- Remove ad-hoc debug logs before submission.

## 14. Route registration and naming

- Keep the assignment routes available exactly at `/sessions`.
- Do not require an `/api/v1` prefix for the submitted contract.
- Mount the session module once from the central router or directly from `app.js` through its public `index.js` export.
- Use plural nouns for resource routes and HTTP verbs for behavior.
- Do not add controller verbs to URLs such as `/getSessions` or `/createSession`.
- Keep route order explicit: health and sessions first, not-found next, error handler last.

Naming conventions:

- module directory: `modules/sessions/`
- domain-prefixed files: `session.service.js`, `session.repository.js`
- variables/functions: `camelCase`
- classes: `PascalCase`
- constants: `UPPER_SNAKE_CASE` only for true constants
- public API fields: preserve assignment snake_case

## 15. JavaScript implementation rules

- Use `const` by default, `let` only when reassignment is necessary, and never `var`.
- Prefer named functions for lifecycle and domain operations.
- Use `async`/`await` consistently.
- Return early for invalid or terminal conditions.
- Do not mix callbacks and promises except where a Node API such as `server.close()` requires a callback wrapper.
- Avoid mutable module-level state except controlled server/shutdown state.
- Do not monkey-patch globals or Mongoose models.
- Do not use dynamic property access when a normal property is known.
- Do not use `eval`, `new Function`, or shell execution.
- Keep functions focused and files generally below 250–300 lines.
- Write comments for decisions and edge cases, not line-by-line narration.
- Use JSDoc sparingly when it materially clarifies a public function or non-obvious object shape.
- Do not introduce generic base classes, decorators, service locators, or dependency-injection containers.

## 16. Package scripts

Use scripts that reflect the actual JavaScript application:

```json
{
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "lint": "eslint .",
    "test": "node --test",
    "check": "npm run lint && npm test"
  }
}
```

Adjust the test command only if a deliberately selected test runner is installed. Do not add a fake compile/build step to plain Node.js. A deployment platform should run `npm start`.

## 17. Testing rules

Tests should target risk, not chase coverage numbers.

Minimum backend behaviors to verify:

- app can be imported without starting a network listener
- health endpoint responds successfully
- valid POST creates and returns a normalized session
- invalid dates, end-before-start, excessive duration, non-integer duration, non-positive quantity, and unknown fields return `422`
- GET returns persisted sessions newest first
- unknown routes return the stable `404` error shape
- unexpected repository/database failures return a generic `500` without internal leakage

Testing guidance:

- Test Zod schemas as pure units for validation edge cases.
- Test services with repository methods stubbed when practical.
- Keep at least a small API-level test around route/middleware/response integration.
- Use an isolated test database if exercising Mongoose; never point tests at development or production data.
- Clean up connections and servers so the test process exits normally.
- Do not add a large test framework when Node's built-in test runner is sufficient.

## 18. Performance and reliability

- This application does not need caching.
- Avoid synchronous filesystem or CPU-heavy work in request handlers.
- Use projections and `lean()` for read-only list queries when serialization is handled correctly.
- Prevent duplicate client submissions in the frontend; the backend should still validate every request.
- Do not invent idempotency keys for this assignment unless duplicate creation becomes an observed problem.
- Keep health checks independent of expensive business queries. If database readiness is exposed, label it clearly rather than hiding failures.

## 19. Review checklist

Before completing a backend change, verify:

- [ ] Backend files are JavaScript, not TypeScript.
- [ ] Relative ESM imports include `.js`.
- [ ] `app.js` does not listen and `server.js` does not define routes.
- [ ] Environment values are parsed once and no secret is hardcoded.
- [ ] MongoDB connects before the listener starts.
- [ ] Route, controller, service, repository, and model responsibilities remain separate.
- [ ] Request data is validated before the controller.
- [ ] `GET /sessions` and `POST /sessions` preserve the assignment contract.
- [ ] MongoDB internals are not exposed.
- [ ] Not-found and error middleware are last and in the correct order.
- [ ] Shutdown closes the HTTP server and Mongoose connection.
- [ ] Relevant lint and tests were run.
- [ ] No unused reference-project infrastructure or dependencies were copied.
