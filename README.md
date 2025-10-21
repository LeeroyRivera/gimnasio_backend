# gimnasio_backend

Basic Express.js backend scaffold.

## Quick start

- Install dependencies
- Start the dev server with reload
- Health check at /health and sample route at /api/hello

### Scripts

- `npm run dev` - start with nodemon
- `npm start` - start with node

### Env

Copy `.env.example` to `.env` and adjust.

### Structure

- `index.js` - server bootstrap
- `src/routes` - express routers
- `src/controllers` - request handlers
- `src/middleware` - middlewares (logger, 404, error)
- `src/models` - data models
- `src/utils` - helpers
- `test/` - tests

## API
- GET `/health` -> `{ status: 'ok' }`
- GET `/api/hello` -> `{ message: 'Hola desde gimnasio_backend!' }`