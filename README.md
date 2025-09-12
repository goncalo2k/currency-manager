# Uphold Currency Rates — Monorepo

A React-based currency rates viewer backed by a simple BFF for the Uphold API. The app defaults to USD, lets users switch currencies, and keeps values fresh and responsive via debounced input and smart caching.

---

## Acceptance Criteria

- **TC01:** The user input amount is **USD by default**.
- **TC02:** The user can **change between currencies**.
- **TC03:** The app **updates all currency values** on user interaction using a **debounce** mechanism.
- **TC04:** **All values are cached** after the first request.
- **TC05:** When changing the base currency, the app **refreshes cached values by issuing a new API call in the background** and re-populates the cache.

---

## Technical Requirements

### MUST

1. **React** (SPA).
2. **ES6**+ syntax.
3. **At least 10 different currencies** listed.
4. **Uphold JavaScript SDK** used for API interactions.
5. **BFF** to proxy/collate data from Uphold and handle CORS/auth securely.

### MAY

- Proper **linting tools** (ESLint, Prettier).
- Use the **Uphold Design System** for UI components.
- **Handle CORS** without needing a browser extension (via BFF).
- **List all available currencies dynamically** from the API.
- **Unit tests** (e.g., Vitest/Jest, React Testing Library).
- **E2E tests** (e.g., Playwright/Cypress).

---

## Prerequisites

- **Node.js** 18+ and **npm** 9+
- An **Uphold client** (client_id/client_secret) and API base URL.
- For HTTPS local dev (frontend): trust the **self-signed certificate** (see below).

---

## Environment Variables

Create `.env` files for each app.

### `uphold-bff/.env`

```
PORT=7000
UPHOLD_API_BASE_URL=https://wallet-sandbox.uphold.com
UPHOLD_API_BASE_URL=https://api-sandbox.uphold.com
UPHOLD_CLIENT_ID=YOUR_CLIENT_ID
UPHOLD_CLIENT_SECRET=YOUR_CLIENT_SECRET
VITE_BFF_URL=http://localhost:7000
```

### `uphold-frontend/.env`

````VITE_API_BASE_URL=https://wallet-sandbox.uphold.com
VITE_HOST_URL=https://api-sandbox.uphold.com
VITE_CLIENT_ID=YOUR_CLIENT_ID
VITE_CLIENT_SECRET=YOUR_CLIENT_SECRET
VITE_BFF_URL=http://localhost:7000
### `uphold-frontend/.env`

````

## How to run

````
npm i
npm run dev
````

### Sidenotes

The frontend has a self-signed certificate in order to run with https (so, if you're running it locally, you must access https://localhost/<YOUR_PORT>), in order to test the authentication flow.