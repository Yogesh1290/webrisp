#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

console.log('\n🚀 Welcome to create-webrisp!');
console.log('⚡ Generating your HyperEdge application...\n');

const projectName = process.argv[2] || 'my-webrisp-app';
const cwd = process.cwd();
const targetDir = path.join(cwd, projectName);

if (fs.existsSync(targetDir)) {
  console.error(`❌ Error: Directory "${projectName}" already exists.`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

// 1. Create package.json
const pkg = {
  name: projectName,
  private: true,
  type: "module",
  scripts: {
    "build": "webrisp build",
    "start": "node --env-file=.env dist/server.js"
  },
  dependencies: {
    "webrisp": "latest"
  }
};
fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));

// 2. Create tsconfig.json
const tsconfig = {
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  }
};
fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

// 3. Create .env
fs.writeFileSync(path.join(targetDir, '.env'), `SECRET_KEY=super_secret_server_password_123\nWEBRISP_PUBLIC_TITLE=Welcome to HyperEdge`);

// 4. Create src structure
const srcDir = path.join(targetDir, 'src');
fs.mkdirSync(srcDir, { recursive: true });

const serverTs = `import { Webrisp, serveNode, h } from 'webrisp';
import { App } from './App.tsx';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

const app = new Webrisp();
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// Serve static client bundle
app.get('/public/client.js', (c) => {
  const js = fs.readFileSync(path.join(__dirname, 'public/client.js'), 'utf-8');
  return c.text(js, { headers: { 'Content-Type': 'application/javascript' } });
});

// Main Route
app.get('/', (c) => {
  return c.render(h(App, null));
});

serveNode.serve(app, { port: 3000 });
console.log('⚡ HyperEdge server listening on http://localhost:3000');
`;
fs.writeFileSync(path.join(srcDir, 'server.ts'), serverTs);

const clientTs = `import { hydrate } from 'webrisp/client';
import { Counter } from './Counter.tsx';

// Wake up the interactive island
hydrate(Counter);
`;
fs.writeFileSync(path.join(srcDir, 'client.ts'), clientTs);

const appTsx = `import { h } from 'webrisp';
import { Counter } from './Counter.tsx';

export function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Webrisp Framework</title>
        <style>
          {\`body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; line-height: 1.6; }\`}
        </style>
      </head>
      <body>
        <div style="text-align: center; padding: 40px 20px;">
          <h1 style="font-size: 3rem; margin-bottom: 10px;">⚡ Welcome to Webrisp</h1>
          <p style="font-size: 1.2rem; color: #666;">The HyperEdge Framework. Zero bloat, maximum performance.</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 12px; border: 1px solid #eee;">
          <p>This page is rendered entirely on the server. The interactive counter below is a hydrated Preact Island.</p>
          <div id="webrisp-root">
            <Counter />
          </div>
        </div>
        <script type="module" src="/public/client.js"></script>
      </body>
    </html>
  );
}
`;
fs.writeFileSync(path.join(srcDir, 'App.tsx'), appTsx);

const counterTsx = `import { h, signal } from 'webrisp/client';

const count = signal(0);

export function Counter() {
  return (
    <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: white; margin-top: 20px;">
      <h2 style="margin-top: 0;">Island Reactivity</h2>
      <p style="font-size: 1.5rem; font-weight: bold;">Count: {count.value}</p>
      <button 
        onClick={() => count.value++} 
        style="padding: 10px 20px; cursor: pointer; background: black; color: white; border: none; border-radius: 6px; font-size: 1rem;"
      >
        Increment
      </button>
      <p style="margin-top: 15px; color: gray; font-size: 0.9rem;">
        <i>Injected Public Env: {process.env.WEBRISP_PUBLIC_TITLE}</i>
      </p>
    </div>
  );
}
`;
fs.writeFileSync(path.join(srcDir, 'Counter.tsx'), counterTsx);

console.log('✅ Project scaffolded successfully!\n');
console.log('Next steps:');
console.log('  cd ' + projectName);
console.log('  npm install');
console.log('  npm run build');
console.log('  npm run start\n');
