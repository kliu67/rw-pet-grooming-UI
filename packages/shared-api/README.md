# shared-api

Reusable backend client helpers for `groomify-console` and `groomify-ui`.

## What lives here

- `createApiFetch`: shared HTTP client factory
- `createClientsApi`: resource API for `/api/clients`

## Usage pattern

1. Build an app-local `apiFetch` with app env config.
2. Build resource APIs by passing that `apiFetch`.
3. Keep React Query hooks app-local unless behavior is identical.

### Example (`apps/groomify-console`)

```js
import { createApiFetch, createClientsApi } from "@shared-api";

const apiFetch = createApiFetch({ baseUrl: import.meta.env.VITE_API_URL });
const clientsApi = createClientsApi({ apiFetch });
```

## Next migrations

- Copy existing resource files from `apps/groomify-console/src/api/*.js` into
  `packages/shared-api/src/resources/*`.
- Replace app-local resource implementation with thin wrappers that consume
  shared resource factories.
