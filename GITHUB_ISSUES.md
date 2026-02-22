# Stellar Wave 2 - GitHub Issues

Here are the 10 architectural and setup issues formatted for GitHub. You can copy and paste these directly into your GitHub repository's issue tracker for your team to pick up during Stellar Wave 2.

---

## 1. [Architecture] Missing Core Next.js Entry Points (`app/layout.tsx`, `app/page.tsx`)

**Description:**
The application was initialized using Next.js 14 App Router, but it is currently missing the foundational files (`layout.tsx` and `page.tsx`) required for the application to compile and render its initial view.
Currently, the `app/` directory only contains `globals.css` and a `favicon.ico` (implicitly). Without the root layout, there is no place to inject global CSS and provider contexts (such as State Management, Stellar SDK Providers, or Theme Providers) necessary for the rest of the dashboard.
This task focuses on establishing the core skeleton of the application so that other team members can begin dropping their features into a working Next.js environment.

**Acceptance Criteria:**
- Create `app/layout.tsx` returning a proper generic HTML skeleton (`<html><body>...</body></html>`).
- Import `globals.css` into `app/layout.tsx` so Tailwind styles govern the application globally.
- Ensure `layout.tsx` exposes a `children` prop capable of rendering sub-routes (like our future `/dashboard` or `/payroll` routes).
- Add `Metadata` object to `app/layout.tsx` exporting standard title (`ZK Payroll Dashboard`) and description tags for basic SEO/display purposes.
- Create `app/page.tsx` as the landing view or entry point. This should either be the public-facing landing page or a redirection to the dashboard component.
- The `app/page.tsx` must render the existing `WalletConnect.tsx` or `PayrollSummary.tsx` components to verify that existing UI blocks function correctly under the new layout.
- Verify the application runs locally by executing `npm run dev` and ensuring `http://localhost:3000` loads a page successfully without Next.js compilation or rendering throwing errors.

---

## 2. [Setup] Missing `zustand` Dependency in `package.json`

**Description:**
The application intends to use `zustand` for its global state management. Currently, the files `stores/company.ts`, `stores/employees.ts`, and `stores/wallet.ts` attempt to import `create` from `zustand` and `persist` from `zustand/middleware`. However, `zustand` was never added to the `package.json` dependencies. 
This omission means any developer attempting to run `npm install` and compile the application will immediately hit module resolution errors ("Cannot find module 'zustand'"). Adding the dependency formally ensures the state stores compile successfully so they can be integrated into the Next.js frontend pages.

**Acceptance Criteria:**
- Install `zustand` to the project dependencies (run `npm install zustand` or `yarn add zustand`).
- Verify that `package.json` now includes `"zustand"` within the `"dependencies"` block.
- Verify that TypeScript errors disappear in `stores/company.ts`, `stores/employees.ts`, and `stores/wallet.ts`.
- Run `npm run build` or `npm run dev` to confirm the application no longer throws "module not found" errors related to `zustand`.

---

## 3. [Architecture] Design and Implement Robust Stellar & Soroban Provider Context

**Description:**
The application lacks a reliable infrastructure to communicate with the Stellar network and invoke Soroban smart contracts. We need a robust, production-ready `StellarProvider` that manages wallet connections, network states (Testnet/Mainnet), and seamlessly injects this context across the entire Next.js application.
Given the asynchronous nature of blockchain interactions, this provider needs to handle edge cases like wallet disconnects, network switching, and concurrent transaction requests. It should integrate with our existing `zustand` state to maintain a source of truth for the wallet's public key, connection status, and active network, minimizing unneeded React re-renders while allowing deep components to trigger Soroban contract calls easily.

**Acceptance Criteria:**
- Install `@stellar/stellar-sdk`, `@stellar/freighter-api`, and any associated Soroban client bindings.
- Create a `components/providers/StellarProvider.tsx` context wrapper.
- Implement an initialization sequence that checks for the presence of the Freighter extension on mount and hydrates the `zustand` wallet store if previously connected.
- The provider must export a custom hook (e.g., `useStellar()`) that provides normalized methods for standard operations: `connect`, `disconnect`, `signTransaction`, and `invokeContract`.
- Implement a graceful fallback/error UI overlay for cases where the user attempts a blockchain action without the wallet installed or while on the wrong Stellar network.
- Add event listeners (if applicable via Freighter API) to detect account changes or network changes initiated directly from the extension, keeping the frontend state perfectly synced.
- Verify the context works globally by dropping a debug component in the dashboard that displays the current network horizon URL and the active Soroban RPC endpoint being used.

---

## 4. [Refactor] Replace Mocked `WalletConnect` with Interactive Stellar Wallet Component

**Description:**
The current `components/WalletConnect.tsx` is an empty shell using a hardcoded `useState` boolean to simulate a connection. For Stellar Wave 2, this must become a fully functional, interactive component that interfaces with the newly designed `StellarProvider` (Issue 3).
This component needs to handle critical UI/UX states: what users see before they connect, the loading/signing states, what happens if the wallet fails to authorize, and how the connection visually represents the payload. Since this is the primary gateway for users to interact with our ZK Payroll Dashboard, the component must be highly polished, accessible, and robust against race conditions.

**Acceptance Criteria:**
- Refactor `WalletConnect.tsx` to consume the context hook (e.g., `useStellar()`) from the global provider.
- Implement conditional rendering: 
  - **Unconnected**: Show "Connect Freighter" button.
  - **Connecting/Loading**: Display a spinner and disable the button to prevent multiple overlapping authorization requests.
  - **Connected**: Display the truncated public key (e.g., `GBXT...J29M`) alongside a visual indicator (like a green network status dot).
- Add a dropdown menu to the "Connected" state, giving users options to view their public key on the Stellar Expert block explorer, copy the address to their clipboard, or cleanly Disconnect.
- Ensure the connection triggers hydration to the global `zustand` state so the main `PayrollSummary` can immediately read the user's wallet address.
- Build error handling directly into the component's UI (e.g., a toast notification or inline red text) if the user rejects the connection prompt from the Freighter extension.

---

## 5. [Architecture] Integrate Zero-Knowledge (ZK) Proof Generator & Verifier Core

**Description:**
As a "ZK-Payroll" application interacting with Stellar Soroban, the dashboard must generate and optionally verify Zero-Knowledge proofs locally in the browser before submitting transactions. Currently, there are no cryptographic libraries or WASM modules integrated to handle this.
This issue requires setting up the client-side cryptographic engine. It dictates that sensitive payroll data (salaries, employee SSNs) is securely hashed and verified entirely on the user's device, turning that logic into a succinct Soroban-compatible proof payload.

**Acceptance Criteria:**
- Select and install the appropriate ZK proving library (e.g., `snarkjs`, `o1js`, or Aztec's `noir` WASM packages) based on our backend Soroban contract compatibility.
- Create a `lib/zk/` directory to manage all Zero-Knowledge related logic, completely abstracted away from the UI components.
- Implement an async `ZkEngine` singleton or context provider that handles fetching the `verification_key.json` and the `.wasm` circuit files from the Next.js `public/` directory upon initialization.
- Write a utility function `generatePayrollProof(inputs: PayrollSecrets)` that takes plain text inputs, generates a verifiable proof, and formats it specifically for a Stellar Soroban contract invocation payload (e.g., mapping to ScVals).
- Ensure the bundle size is optimized (via dynamic imports or Next.js Webpack configuration) so the heavy compilation of the WASM cryptographic engine does not block the initial page load for non-payroll views.

---

## 6. [Setup] Configure Enterprise-Grade Testing & CI Environment

**Description:**
While a dummy `__tests__/components.test.tsx` file exists, the project has zero testing infrastructure installed (`package.json` lacks testing dependencies) or configured. For a financial payroll application handling cryptographic proofs and on-chain transactions, untestable code is unacceptable.
We must establish a robust unit and integration testing suite. This setup will be the foundation for our GitHub Actions CI/CD pipeline, guaranteeing that changes to the React components or the ZK/Soroban logic do not break existing functionality.

**Acceptance Criteria:**
- Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` as `devDependencies`.
- Create a `vitest.config.ts` configured for React (by utilizing `@vitejs/plugin-react`) and setting the environment strictly to `jsdom`.
- Set up a `setupTests.ts` file to automatically import `@testing-library/jest-dom` for augmented DOM assertions (e.g., `expect().toBeInTheDocument()`) and to polyfill `TextEncoder`/`TextDecoder` which are often required by Stellar SDK and WASM tests in a Node environment.
- Add `test`, `test:watch`, and `test:coverage` scripts to the `package.json`.
- Write a meaningful passing test for the `PayrollSummary.tsx` component to prove the testing library properly renders components interacting with global state.
- Create a boilerplate `MockStellarProvider` wrapper in `__tests__/utils/` to be used in future component tests that depend on Freighter/Stellar context.

---

## 7. [Setup] Configure Environment Variables and Webpack WASM Next.js Config

**Description:**
The dashboard lacks crucial configuration setups necessary for Web3 applications. First, there is no `.env.example` file to manage public variables (like Stellar horizon URLs) or secret keys for testnet funding. Second, our ZK integration requires a `next.config.js` capable of handling `.wasm` files. By default, Next.js does not configure Webpack to output WebAssembly modules cleanly, which breaks cryptographic libraries like `snarkjs` or `noir`.
This issue provides the foundational environment mapping and build configuration so that subsequent ZK integration issues don't face complex bundling errors.

**Acceptance Criteria:**
- Create an `.env.example` mapping out variables: `NEXT_PUBLIC_STELLAR_NETWORK` (TESTNET/PUBLIC), `NEXT_PUBLIC_HORIZON_URL`, and `NEXT_PUBLIC_SOROBAN_RPC_URL`.
- Implement a type-safe environment loader in `lib/env.ts` using `zod` to validate environment variables at build/runtime.
- Create a `next.config.mjs` file.
- Add an overriding Webpack configuration to `next.config.mjs` to properly load `.wasm` files as assets/resources, specifically disabling dynamic routing strictness for WASM imports if necessary based on your ZK library choice.
- Verify the build command (`npm run build`) still succeeds without warnings post-configuration.

---

## 8. [UI/UX] Adopt `shadcn/ui` Component Architecture

**Description:**
The current UI architecture is ad-hoc, utilizing raw Tailwind CSS classes directly on standard HTML elements scattered throughout component files. To build a premium enterprise application rapidly, we need a robust, accessible component library.
We are standardizing on `shadcn/ui` (built on top of Radix UI primitives). This choice guarantees high accessibility (ARIA compliant), beautiful defaults, and the ability to maintain our own style definitions inside our repository rather than battling a heavy third-party CSS node module.

**Acceptance Criteria:**
- Initialize `shadcn/ui` using `npx shadcn-ui@latest init` (Select TypeScript, Tailwind, and CSS variables).
- Define a cohesive brand color palette inside the generated `app/globals.css` and align the `tailwind.config.ts` accordingly.
- Use the CLI to install the essential foundational components: `Button`, `Card`, `Dialog` (for modals like wallet signing), `DropdownMenu` (for the wallet address), `Toast`/`Toaster` (for transaction success/fail notifications), and `Input` (for the payroll forms).
- Refactor the existing primitive buttons (like the one in `components/WalletConnect.tsx`) to utilize the newly imported `shadcn/ui` `<Button />` component.
- Ensure all installed primitive source code is correctly nested in the `components/ui/` directory.

---

## 9. [Architecture] Establish Global TypeScript Definitions (`types/`)

**Description:**
As the schema grows to include complex items like Soroban contract invocations, ZK payload proofs, and decentralized employee records, maintaining ad-hoc interfaces (e.g., `interface Company` just sitting inside `stores/company.ts`) will lead to severe technical debt and tight coupling.
We need a centralized, strictly-typed data dictionary. This ensures that the Frontend UI, the Zustand Stores, and the Soroban/WASM APIs speak the exact same language and can share types reliably.

**Acceptance Criteria:**
- Create a `types/` directory at the project root.
- Create `types/models.ts` to hold core domain structures (e.g., `Employee`, `PayrollTransaction`, `Company`).
- Create `types/stellar.ts` to map specific Stellar/Soroban responses, including custom ScVals wrappers or Freighter network signatures.
- Create `types/zk.ts` to define the shape of proof payloads generated by our circuit (e.g., `interface PayrollProof { publicSignals: string[]; proof: Record<string, any> }`).
- Refactor `stores/company.ts` and `stores/employees.ts` to import these newly globalized interfaces and remove their local, redundant definitions.

---

## 10. [Architecture] Standardize Component Directory Structure

**Description:**
The `components/` directory is currently disorganized. It mixes top-level feature components (`PayrollSummary.tsx`) with nested layout components (`layout/DashboardLayout.tsx`), and lacks a clear separation between generic UI primitives (like buttons/inputs) and domain-specific business logic.
To ensure the codebase scales safely during Stellar Wave 2, a standardized mental model (similar to Atomic Design or Feature Sliced Design) must be established so developers immediately know where a file belongs.

**Acceptance Criteria:**
- Restructure the `components/` directory into three rigid sub-domains:
  - `components/ui/` (Reserved exclusively for dumb, stateless primitives like the ones generated by `shadcn/ui`).
  - `components/layout/` (Main shell structures: Headers, Sidebars, Footers, and standard page wrappers).
  - `components/features/` (Domain-specific logic: E.g., `features/payroll/PayrollSummary.tsx`, `features/wallet/WalletConnect.tsx`).
- Update all `export` semantics to be consistent (e.g., choose between named exports or default exports and enforce it across all files).
- Update imports across the `app/` and `stores/` codebases to reflect these new paths, verifying that the project compiles with zero path resolution warnings.

---

## 11. [Setup] Add Comprehensive `.gitignore` File

**Labels:** `good-first-issue`, `setup`, `priority: critical`
**Points:** 100

**Description:**
The repository is currently missing a `.gitignore` file entirely. This is a critical oversight for any Node.js/Next.js project — without it, developers risk accidentally committing sensitive files (`.env`, `.env.local`), bulky dependency directories (`node_modules/`), IDE-specific configuration folders (`.vscode/`, `.idea/`), operating system artifacts (`.DS_Store`, `Thumbs.db`), build output (`.next/`, `out/`), and WASM compilation artifacts to the repository.

For a financial payroll application handling private keys and ZK proofs, accidentally pushing an `.env` file containing Stellar secret keys or Soroban contract deployer seeds would be a catastrophic security incident. This issue must be resolved before any other development work begins.

**Acceptance Criteria:**
- Create a `.gitignore` file at the project root.
- Include standard Node.js ignores: `node_modules/`, `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`, `.pnpm-debug.log*`.
- Include Next.js build output ignores: `.next/`, `out/`, `build/`.
- Include environment variable ignores: `.env`, `.env.local`, `.env.development.local`, `.env.test.local`, `.env.production.local`, `.env*.local`.
- Include IDE/editor ignores: `.vscode/`, `.idea/`, `*.swp`, `*.swo`.
- Include OS ignores: `.DS_Store`, `Thumbs.db`, `desktop.ini`.
- Include TypeScript build info ignores: `*.tsbuildinfo`, `next-env.d.ts`.
- Include testing/coverage output ignores: `coverage/`, `.nyc_output/`.
- Include ZK/WASM compilation artifact ignores: `public/*.wasm` (generated circuits), `public/verification_key.json` (generated keys), `*.ptau`.
- Include lock file consistency rules (comment indicating which package manager lock file to keep).
- Verify that running `git status` after creating the file no longer shows OS or IDE artifacts as untracked, and that `node_modules/` would not be committed if present.

---

## 12. [Setup] Populate `tsconfig.json` with Strict Next.js TypeScript Configuration

**Labels:** `good-first-issue`, `setup`, `priority: critical`
**Points:** 100

**Description:**
The `tsconfig.json` file currently exists but is completely empty (0 bytes). This means TypeScript has zero configuration — no compiler options, no path aliases, no strict mode enforcement, and no module resolution strategy. This effectively makes every `.ts` and `.tsx` file in the project un-compilable via `tsc` and prevents Next.js from generating its own type-checking augmentations (like `next-env.d.ts`).

Without a populated `tsconfig.json`, developers cannot benefit from IDE autocompletion, type safety, or path aliases (`@/components/...`) that are standard in modern Next.js TypeScript projects.

**Acceptance Criteria:**
- Populate `tsconfig.json` with a full Next.js 14 App Router-compatible configuration.
- Enable `"strict": true` to enforce strict null checks, no implicit any, and all other strict-mode flags — essential for a financial application.
- Set `"target": "es5"` and `"lib": ["dom", "dom.iterable", "esnext"]` for browser compatibility.
- Set `"moduleResolution": "bundler"` and `"module": "esnext"` for Next.js App Router compatibility.
- Configure path aliases: `"@/*": ["./*"]` so imports can use `@/components/...`, `@/stores/...`, `@/lib/...`.
- Include `"jsx": "preserve"` for Next.js JSX handling.
- Add `"incremental": true` for faster subsequent builds.
- Set appropriate `"include"` (`["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]`) and `"exclude"` (`["node_modules"]`) arrays.
- Verify that `npm run build` or `npx tsc --noEmit` runs without errors related to configuration.

---

## 13. [Setup] Add Missing `postcss.config.js` for Tailwind CSS Pipeline

**Labels:** `good-first-issue`, `setup`, `priority: high`
**Points:** 100

**Description:**
Although `tailwind.config.ts` and Tailwind-related devDependencies (`tailwindcss`, `postcss`, `autoprefixer`) exist in the project, there is no `postcss.config.js` file. PostCSS is the CSS processing engine that Tailwind CSS relies on — without this configuration file, the Tailwind directives (`@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`) in `app/globals.css` will not be processed, and no utility classes will be generated.

This means every Tailwind class used in every component (`className="bg-white p-6 rounded-lg ..."`) is currently non-functional in a fresh build.

**Acceptance Criteria:**
- Create `postcss.config.js` (or `postcss.config.mjs`) at the project root.
- Register `tailwindcss` and `autoprefixer` as PostCSS plugins.
- Verify that running `npm run dev` generates the expected CSS output by inspecting that Tailwind utility classes (e.g., `bg-white`, `text-gray-500`) apply styles correctly in the browser.
- Confirm that `npm run build` completes without PostCSS-related warnings or errors.

---

## 14. [Architecture] Build Secure API Route Layer for Payroll Operations

**Labels:** `medium`, `architecture`, `priority: high`
**Points:** 150

**Description:**
The application currently has zero API routes (`app/api/` does not exist). All payroll data (salaries, employee counts, transaction history) is hardcoded directly in frontend components. For a production-grade payroll application, we need a server-side API layer to:

1. Serve as a secure intermediary between the frontend and the Stellar/Soroban blockchain.
2. Handle payroll calculations, batch transaction assembly, and ZK proof verification server-side where appropriate.
3. Protect sensitive operations behind authentication and rate limiting.
4. Provide clean REST endpoints that the React frontend can call via `fetch` or a data-fetching library.

This API layer must follow Next.js 14 App Router conventions using Route Handlers (`route.ts` files).

**Acceptance Criteria:**
- Create the `app/api/` directory structure with the following route groups:
  - `app/api/payroll/route.ts` — GET (list payroll runs), POST (create new payroll run).
  - `app/api/payroll/[id]/route.ts` — GET (single payroll details), PATCH (update status).
  - `app/api/employees/route.ts` — GET (list employees), POST (add employee).
  - `app/api/employees/[id]/route.ts` — GET, PATCH, DELETE for individual employees.
  - `app/api/transactions/route.ts` — GET (list transaction history with pagination).
  - `app/api/health/route.ts` — GET (health check returning application and Stellar network status).
- Each route handler must return proper JSON responses with appropriate HTTP status codes (200, 201, 400, 404, 500).
- Each route handler must include input validation using `zod` schemas.
- Create shared API response helpers in `lib/api/response.ts` for consistent success/error response formatting.
- Write placeholder implementations that return mock data matching the TypeScript interfaces from the `types/` directory (Issue 9).
- Add proper CORS headers configuration if the API will be consumed externally.

---

## 15. [Architecture] Implement React Error Boundaries and Global Error Handling

**Labels:** `medium`, `architecture`, `priority: high`
**Points:** 150

**Description:**
The application has zero error handling infrastructure. There are no React Error Boundaries, no global error pages (`error.tsx`, `not-found.tsx`), and no structured way to catch and display errors from failed blockchain transactions, ZK proof generation failures, or network timeouts.

For a financial application where users interact with irreversible blockchain transactions, silent failures are unacceptable. Users must always know the exact state of their actions, and the application must never show a blank white screen due to an unhandled exception.

**Acceptance Criteria:**
- Create `app/error.tsx` — a global error boundary that catches runtime errors in any route segment and displays a user-friendly error page with a "Try Again" button.
- Create `app/not-found.tsx` — a custom 404 page styled consistently with the dashboard design.
- Create `app/loading.tsx` — a global loading state with a skeleton/spinner for route transitions.
- Create a reusable `components/ErrorBoundary.tsx` client component wrapping React's `ErrorBoundary` pattern with:
  - Fallback UI rendering (customizable per usage).
  - Error logging callback (preparing for Sentry/LogRocket integration).
  - "Report Issue" button linking to the repository's GitHub Issues.
- Create `app/global-error.tsx` to handle errors in the root layout itself.
- Wrap critical feature sections (Wallet Connect, Payroll Summary, Transaction History) with the `ErrorBoundary` component.
- Implement a `useErrorHandler` custom hook that feature components can use to programmatically report errors from `catch` blocks (e.g., failed Soroban contract calls).
- Ensure all error boundaries are tested by deliberately throwing errors in dev mode and verifying the fallback UI renders correctly.

---

## 16. [Security] Implement Security Headers and Content Security Policy

**Labels:** `high`, `security`, `priority: critical`
**Points:** 200

**Description:**
As a financial application handling cryptocurrency payroll and ZK proofs, the dashboard is a high-value target for XSS, clickjacking, and injection attacks. Currently, the application has zero security headers configured — no Content Security Policy (CSP), no X-Frame-Options, no Strict-Transport-Security.

This is a critical vulnerability for an application that will interact with wallet extensions (which inject scripts into the page) and process sensitive financial data.

**Acceptance Criteria:**
- Create `middleware.ts` at the project root to inject security headers into every response.
- Implement the following headers:
  - `Content-Security-Policy` — Strict CSP allowing only the application's own scripts, styles, and the Freighter wallet extension. Must allow `wasm-unsafe-eval` for ZK WASM modules.
  - `X-Frame-Options: DENY` — Prevent clickjacking.
  - `X-Content-Type-Options: nosniff` — Prevent MIME-type sniffing.
  - `Referrer-Policy: strict-origin-when-cross-origin` — Limit referrer information leakage.
  - `Permissions-Policy` — Disable unnecessary browser features (camera, microphone, geolocation).
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` — Enforce HTTPS.
  - `X-XSS-Protection: 0` — Disable legacy XSS filter (CSP is the modern replacement).
- Create a CSP reporting endpoint in `app/api/csp-report/route.ts` to capture and log policy violations.
- Add environment-specific CSP configurations (looser in development for hot-reload, strict in production).
- Document the CSP policy decisions in a `SECURITY.md` file explaining why each directive is configured as it is.
- Verify headers are present by inspecting network responses in browser DevTools.

---

## 17. [Architecture] Implement Next.js Middleware for Authentication & Route Protection

**Labels:** `high`, `architecture`, `priority: high`
**Points:** 200

**Description:**
The dashboard currently has no route protection. Any user (connected wallet or not) can theoretically access any page in the application. For a payroll dashboard handling employee compensation data, this is a significant security concern.

We need a Next.js middleware layer that intercepts requests, verifies wallet connection status, and redirects unauthenticated users to a login/connect page. This middleware should also handle role-based access control (e.g., distinguishing between company admins who can run payroll vs. employees who can only view their own records).

**Acceptance Criteria:**
- Create `middleware.ts` at the project root (or extend if created in Issue 16).
- Define protected route patterns: `/dashboard/*`, `/payroll/*`, `/employees/*`, `/settings/*`.
- Define public route patterns: `/`, `/login`, `/api/health`.
- Implement wallet-based authentication check:
  - Read a session token or signed message from cookies/headers.
  - If absent or invalid, redirect to the login/connect page.
- Create `app/login/page.tsx` — a dedicated wallet connection page that users are redirected to when attempting to access protected routes.
- Implement a `lib/auth/session.ts` utility for creating and verifying session tokens signed by the user's Stellar keypair.
- Add role-based route guards: routes matching `/payroll/run` or `/employees/add` require `admin` role.
- Ensure API routes (`/api/*`) return `401 Unauthorized` JSON responses (not redirects) for unauthenticated requests.
- Write unit tests for the session token creation and verification logic.

---

## 18. [UI/UX] Implement WCAG 2.1 AA Accessibility Compliance

**Labels:** `medium`, `ui/ux`, `priority: medium`
**Points:** 150

**Description:**
The current codebase has no accessibility considerations. Components lack ARIA labels, semantic HTML is underutilized (generic `<div>` elements everywhere), there is no keyboard navigation support, color contrast ratios are unchecked, and focus management is absent.

As a financial application, accessibility is not just a best practice — it may be a legal requirement depending on the jurisdiction. Additionally, accessible applications provide a better experience for all users, including those using screen readers, keyboard-only navigation, or high-contrast modes.

**Acceptance Criteria:**
- Audit all existing components (`PayrollSummary`, `WalletConnect`, `TransactionHistory`, `Header`, `Sidebar`, `DashboardLayout`) for accessibility violations.
- Replace non-semantic markup:
  - Use `<nav>` for navigation elements in `Sidebar.tsx` and `Header.tsx`.
  - Use `<main>` for the primary content area in `DashboardLayout.tsx`.
  - Use `<section>` and `<article>` where appropriate in `PayrollSummary.tsx`.
  - Use `<button>` elements (not styled `<div>`) for all interactive elements.
- Add comprehensive ARIA attributes:
  - `aria-label` for icon-only buttons.
  - `aria-live="polite"` regions for dynamic content (payroll totals, transaction updates).
  - `aria-expanded` and `aria-controls` for collapsible sidebar sections.
  - `role="status"` for connection status indicators.
- Implement keyboard navigation:
  - All interactive elements must be focusable via `Tab`.
  - `Escape` key closes modals/dropdowns.
  - `Enter`/`Space` activates buttons and links.
  - Visible focus indicators (no `outline: none` without replacement).
- Verify color contrast ratios meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text) using the existing custom indigo palette.
- Install and configure `eslint-plugin-jsx-a11y` as a devDependency to enforce accessibility rules at lint time.
- Add a `prefers-reduced-motion` media query check to disable animations for users who prefer reduced motion.

---

## 19. [Setup] Implement Structured Logging and Error Monitoring Infrastructure

**Labels:** `medium`, `setup`, `priority: medium`
**Points:** 150

**Description:**
The application currently uses only raw `console.log` and `console.error` statements for debugging, with no structured logging, no log levels, and no external error monitoring integration. For production deployment of a financial application, this is insufficient.

We need a logging infrastructure that provides structured, leveled logging on both the client and server side, and an integration path for external monitoring services (Sentry, LogRocket, DataDog) to capture unhandled exceptions and performance metrics.

**Acceptance Criteria:**
- Create `lib/logger.ts` — a lightweight, isomorphic logging utility that works in both client (browser) and server (Next.js API routes/server components) contexts.
- Implement log levels: `debug`, `info`, `warn`, `error`, `fatal`.
- Each log entry must be structured as JSON containing: `timestamp`, `level`, `message`, `context` (component/module name), and optional `metadata` (key-value pairs).
- In development mode, output human-readable colorized logs to the console.
- In production mode, output JSON-structured logs suitable for log aggregation services.
- Create `lib/monitoring.ts` — an abstraction layer for error monitoring that:
  - Exports an `initMonitoring()` function to be called once in the root layout.
  - Exports a `captureException(error, context)` function used throughout the app.
  - Starts with a console-based implementation but is structured for drop-in Sentry/LogRocket replacement.
- Replace all existing `console.error` calls in `stores/wallet.ts` and other files with the new structured logger.
- Add performance marks for critical user flows: wallet connection time, ZK proof generation time, Soroban transaction confirmation time.
- Ensure no sensitive data (private keys, salary amounts, employee PII) is ever logged — add a `sanitize()` utility that redacts sensitive fields.

---

## 20. [DevOps] Create Docker Configuration and GitHub Actions CI/CD Pipeline

**Labels:** `high`, `devops`, `priority: high`
**Points:** 200

**Description:**
The project has no containerization or continuous integration/deployment setup. For a team working on a financial application during the Stellar Wave 2 program, we need:

1. A reproducible development environment via Docker so all contributors work in identical environments.
2. A CI pipeline that runs on every pull request to catch regressions before merge.
3. A CD pipeline that auto-deploys to a staging environment (e.g., Vercel preview deployments) for QA review.

**Acceptance Criteria:**
- Create `Dockerfile` — a multi-stage Docker build:
  - **Stage 1 (deps):** Install dependencies using the lock file for deterministic builds.
  - **Stage 2 (builder):** Run `npm run build` to generate the Next.js production bundle.
  - **Stage 3 (runner):** Copy the standalone output into a minimal `node:18-alpine` image.
  - The final image must be under 200MB and expose port 3000.
- Create `docker-compose.yml` for local development:
  - `app` service running the Next.js dev server with hot-reload via volume mounts.
  - `stellar-quickstart` service (optional) running a local Stellar testnet for offline development.
- Create `.dockerignore` to exclude `node_modules/`, `.next/`, `.git/`, and `.env*` from the Docker build context.
- Create `.github/workflows/ci.yml` GitHub Actions workflow:
  - Triggered on `push` to `main` and on all `pull_request` events.
  - **Lint job:** Run `npm run lint`.
  - **Type check job:** Run `npx tsc --noEmit`.
  - **Test job:** Run `npm test` (once testing is set up per Issue 6).
  - **Build job:** Run `npm run build` to verify the production build succeeds.
  - Cache `node_modules/` and `.next/cache/` between runs for speed.
- Create `.github/workflows/deploy.yml` GitHub Actions workflow:
  - Triggered on `push` to `main` only.
  - Deploy to Vercel (or configured hosting) using the Vercel CLI or GitHub integration.
  - Post deployment URL as a comment on the associated PR (if applicable).
- Add status badges for CI/CD pipeline status to `README.md`.
