# Node.JS

A collection of Node.js / TypeScript exercises and a small REST API, built while working through Mosh Hamedani's Node.js course.

## Structure

| Path | Description |
|---|---|
| `vidly-api/` | REST API for managing movie genres, customers, movies, rentals and users (Express + MongoDB + Mongoose + JWT auth). Includes Jest + Supertest route tests. |
| `testing-demo/` | Standalone examples of unit testing with Jest (`fizzBuzz`, `lib`, `mail`, `db`). |
| `get_backend_courses/` | Mongoose exercise: querying and seeding a `courses` collection. |
| `get_expensive_or_by_courses/` | Mongoose exercise: `$or` / comparison queries on courses. |
| `get_published_courses_by_price/` | Mongoose exercise: filtering published courses by price. |
| `promise_rewrite_async_await/` | Exercise converting Promise chains to `async/await`. |

Each folder is an independent Node.js project with its own `package.json`.

---

## `vidly-api`

REST API with the following routes:

- `src/routes/genres.ts` — CRUD for genres (`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`)
- `src/routes/customers.ts` — customers
- `src/routes/movies.ts` — movies
- `src/routes/rentals.ts` — rentals
- `src/routes/users.ts` — user registration
- `src/routes/auth.ts` — login / JWT issuing
- `src/middleware/auth.ts` — JWT verification middleware
- `src/models/` — Mongoose schemas + Joi validators for each entity
- `src/config.ts` — reads `JWT_PRIVATE_KEY` from env
- `src/index.ts` — app entry point, connects to MongoDB and mounts all routes

### Tests

- `src/tests/user.test.ts` — unit tests for `User.generateAuthToken`
- `src/tests/genres.test.ts` — route tests for the genres module (all HTTP methods: `GET`, `POST`, `PUT`, `DELETE`), covering status codes 200/400/401/404. The `Genre` model is mocked, so these tests don't need a running database.

### Setup & run

```bash
cd vidly-api
npm install
cp .env.example .env   # set JWT_PRIVATE_KEY
npm run dev             # start in dev mode (ts-node-dev)
# or
npm run build && npm start
```

Requires a local MongoDB instance running at `mongodb://localhost/vidly` to actually use the API (not required for running the tests).

### Run tests

```bash
cd vidly-api
npm test
```

---

## `testing-demo`

```bash
cd testing-demo
npm install
npm test
```

---

## Mongoose (`get_backend_courses`, `get_expensive_or_by_courses`, `get_published_courses_by_price`)

Each requires a local MongoDB at `mongodb://localhost/mongo-exercises`. Run with `ts-node`:

```bash
cd get_backend_courses
npm install
npx ts-node seed.ts     # seed sample data
npx ts-node index.ts    # run the queries
```

Same pattern for the other two folders (single `.ts` file each, no seed script needed if the DB is already seeded).

---

## `promise_rewrite_async_await`

```bash
cd promise_rewrite_async_await
npm install
npx ts-node promiseRewriteAsyncAwait.ts
```
