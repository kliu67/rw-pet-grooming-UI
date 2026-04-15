# shared-utils

Reusable UI-facing helpers shared across `groomify-console` and `groomify-ui`.

## What lives here

- Validation helpers (price, phone, email)
- Display name helpers (lexical + standard)
- `isObjectNotEmpty` guard

## Usage pattern

```js
import { isValidEmail, getNameStandard } from "@shared-utils";
```
