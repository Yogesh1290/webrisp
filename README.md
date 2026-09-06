# ⚡ Webrisp - The HyperEdge Framework

Webrisp is a zero-bloat, ultra-high-performance web framework designed for the Edge. It brings the power of Server-Side Rendering (SSR) and Island Architecture (Partial Hydration) into a single, unified developer experience—without the massive overhead of Next.js or React 19.

- **3.8 KB Client JS Footprint:** Ships zero JavaScript for static layouts, and only 3.8KB for the interactive Island engine (powered by Preact Signals).
- **100% React Ecosystem Compatibility:** Seamlessly import Radix UI, Lucide Icons, or Tailwind components. Webrisp automatically aliases them to our feather-weight engine at compile time.
- **Single-Flight Anti-Stampede Shield:** Hardcoded resource locks ensure that 10,000 concurrent visitors trigger exactly 1 server render, protecting your hosting quotas.

## 🛠 What Language Do I Use?

You write Webrisp applications in **TypeScript** using **TSX/JSX** for UI components.

## 📦 Installation & Setup

Webrisp includes a built-in generator to instantly scaffold your project. Run these commands in an empty directory:

```bash
npm create webrisp@latest my-app
cd my-app
npm install
npm run build
npm run start
```

## 🏗 Project Structure

A Webrisp application is incredibly simple. There is no messy `pages/` or `app/` folder magic unless you build it. You have total control.

```text
my-webrisp-app/
├── .env                  # Environment variables
├── package.json          # Your npm dependencies
└── src/
    ├── server.ts         # The HyperEdge Kernel (Server Entrypoint)
    ├── client.ts         # The Client Engine (Browser Entrypoint)
    ├── App.tsx           # Your server-rendered UI layout
    └── Counter.tsx       # An interactive Client Island
```

## 🚀 How to Write a Webrisp App

### 1. The Server Entrypoint (`src/server.ts`)
This is where you define your API routes and SSR pages. It runs entirely on the server.

```typescript
import { Webrisp, serveNode, h } from 'webrisp';
import { App } from './App.tsx';

const app = new Webrisp();

// Serve the compiled client JavaScript
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
app.get('/public/client.js', (c) => {
  const js = fs.readFileSync(path.join(__dirname, 'public/client.js'), 'utf-8');
  return c.text(js, { headers: { 'Content-Type': 'application/javascript' } });
});

// Render the main page (SSR)
app.get('/', (c) => {
  return c.render(h(App, null));
});

// Start the server
serveNode.serve(app, { port: 3000 });
console.log('⚡ Server running at http://localhost:3000');
```

### 2. The Client Island (`src/Counter.tsx`)
If you need interactive buttons, forms, or animations in the browser, create an Island. Import Reactivity directly from Webrisp!

```tsx
import { h, signal } from 'webrisp/client'; // Notice the /client import!

const count = signal(0);

export function Counter() {
  return (
    <div>
      <p>Count: {count.value}</p>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  );
}
```

### 3. The Client Entrypoint (`src/client.ts`)
Tell the browser which components need to "wake up" (hydrate).

```typescript
import { hydrate } from 'webrisp/client';
import { Counter } from './Counter.tsx';

// Wakes up the counter in the browser!
hydrate(Counter);
```

## 🔒 Security: Environment Variables (.env)

Webrisp enforces a military-grade boundary between your server secrets and browser code.

1. **Server Secrets:** Variables like `DATABASE_URL` or `STRIPE_SECRET_KEY` stay strictly on the server.
2. **Client Variables:** If you need a variable in the browser, you **MUST** prefix it with `WEBRISP_PUBLIC_`.

```env
DATABASE_URL=postgres://...              # SAFE: Hidden from browser
WEBRISP_PUBLIC_API_URL=https://api...    # SAFE: Exposed to browser Island
```

## ⚙️ Building & Running

In your `package.json`, add these scripts:

```json
{
  "scripts": {
    "build": "webrisp build",
    "start": "node --env-file=.env dist/server.js"
  }
}
```

Then run:
```bash
npm run build
npm run start
```

*Welcome to the HyperEdge.*
