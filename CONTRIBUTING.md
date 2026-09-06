# Contributing to Webrisp Framework

Welcome! We are building the fastest, most lightweight React framework in the world by explicitly rejecting the bloat of Next.js, Vite, and Hono. 

We need your help to make it better.

## Project Architecture

This is a monorepo. It is not an app; it is the source code for the framework itself.

- **`/packages/core`**: The native Node.js HTTP router and SSR engine. This is where the magic happens. We use `http.createServer` directly.
- **`/packages/cli`**: The command-line tool (`nexus build`). It uses `esbuild` under the hood to compile user applications in milliseconds.
- **`/examples/basic`**: A playground application. Use this to test the framework as if you were an end-user.

## How to Contribute

1. Modify the core engine in `/packages/core/src/index.ts`.
2. Test your changes by running the example app: `npm run dev`.
3. Ensure the CLI builds successfully: `npm run build:cli`.

### Core Philosophies

1. **Zero Dependencies in Core**: The `core` package must *never* have external dependencies besides React. No Express, no Hono, no utility libraries.
2. **Speed Over Magic**: If a feature requires complicated file-system scanning or bloated memory usage, it gets rejected.
3. **Explicit > Implicit**: We do not use file-based routing. We use programmatic routing (e.g., `app.get()`) because it is faster and easier to debug.
