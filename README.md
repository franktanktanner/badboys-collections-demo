# Bad Boys Collections Demo

Bad Boys Bail Bonds demo for a collections recovery command center. Productization work happens on non-production branches only.

## Productization Sprint 1

### What changed

- Added `src/config/agencyConfig.ts` as the central white-label configuration layer.
- Added productization domain types in `src/types/index.ts` while preserving existing exported names used by the demo.
- Added structured account fixtures in `src/data/accountFixtures.ts`.
- Added selector/helper functions in `src/lib/recoverySelectors.ts` for receivables, accounts, recovered dollars, promises, handoffs, high-risk accounts, and do-not-contact accounts.
- Added typed local recovery action validation in `src/lib/recoveryActions.ts`.
- Updated the account detail panel to show compliance flags and local-only action results.
- Fixed `MiniChart` render purity by replacing render-time random IDs with React `useId()`.

### How agencyConfig works

`src/config/agencyConfig.ts` exports `agencyConfig`, which currently defaults to Bad Boys Bail Bonds. It contains agency identity, dashboard title, initials, slogan, phone number, brand colors, display labels, office data, counties, addresses, and notification emails.

The app still renders the Bad Boys demo by default. Future white-label agencies should start by swapping this config instead of editing layout components directly.

### Where fixture data lives

Structured local account fixtures live in `src/data/accountFixtures.ts`. They keep the existing UI-facing fields such as `bondId`, `defendant`, `indemnitor`, `amountOwed`, `payments`, and `communications`, while also carrying future-shaped fields such as `agencyId`, `officeId`, `contacts`, `bond`, `balance`, `compliance`, `promisesToPay`, `paymentPlans`, `handoffs`, and `outreachEvents`.

The older `src/data/mockAccounts.ts` generator is no longer used by the account table. It remains in the repo for now to avoid a destructive cleanup during this sprint.

### What is still mock/local

- All account, activity, transcript, payment, promise, compliance, and handoff data is local fixture data.
- Action buttons only create local UI events. They do not send calls, SMS, email, skip traces, or payment-plan requests.
- Dashboard and report metrics are selector-backed, but still calculated from local fixtures.
- Automation toggles are still local UI state.

### What is not production-ready yet

- No auth or role-based access control.
- No Supabase live integration.
- No real outreach providers.
- No production import workflow.
- No durable audit log.
- No payment reconciliation or attribution engine.
- Compliance validation is local UI logic only and must be enforced server-side before real outreach exists.

### Next sprint focus

Productization Sprint 2 should focus on the data boundary: replace legacy generated mock files, create typed repository/query functions over fixtures, add empty/loading/error states for future async data, and prepare Supabase schema/type mapping without connecting production data.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
