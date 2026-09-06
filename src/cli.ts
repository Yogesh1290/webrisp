#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as esbuild from 'esbuild';

/**
 * Webrisp Compiler (CLI)
 * 
 * Secure Island Bundler and Server Compiler.
 */

// SECURITY SHIELD: Parse .env and strictly filter variables for the client bundle.
function loadPublicEnvForClient(cwd: string): Record<string, string> {
  const envPath = path.join(cwd, '.env');
  const defines: Record<string, string> = {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  };

  if (fs.existsSync(envPath)) {
    console.log('🔒 Analyzing .env file for Client Bundle...');
    const envFile = fs.readFileSync(envPath, 'utf-8');
    
    envFile.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        val = val.replace(/^['"]|['"]$/g, ''); // strip quotes
        
        // CRITICAL SECURITY ENFORCEMENT:
        // Only inject variables explicitly marked as PUBLIC into the browser bundle.
        // Everything else (DATABASE_URL, STRIPE_SECRET, etc.) is dropped.
        if (key.startsWith('WEBRISP_PUBLIC_')) {
          defines[`process.env.${key}`] = JSON.stringify(val);
        } else {
          // Explicitly set to undefined so if a dev types process.env.DATABASE_URL
          // in client code, it safely evaluates to undefined instead of crashing the bundler
          // or leaking a fallback.
          defines[`process.env.${key}`] = 'undefined';
        }
      }
    });
  }
  
  return defines;
}

export async function runCLI(args: string[]) {
  const command = args[0] || 'build';
  console.log(`\n⚡ Webrisp HyperEdge Compiler v0.1.5\n`);

  if (command === 'init') {
    console.log('🚀 Initializing a new Webrisp project...\n');
    const cwd = process.cwd();

    // 1. Create or update package.json
    const pkgPath = path.join(cwd, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      const pkg = {
        name: 'my-webrisp-app',
        type: 'module',
        scripts: {
          "build": "webrisp build",
          "start": "node --env-file=.env dist/server.js"
        },
        dependencies: {
          "webrisp": "latest"
        }
      };
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      console.log('✅ Created package.json');
    } else {
      console.log('⚠️  package.json already exists, adding scripts and type: module...');
      try {
        const existingPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        existingPkg.type = 'module';
        existingPkg.scripts = existingPkg.scripts || {};
        existingPkg.scripts.build = existingPkg.scripts.build || "webrisp build";
        existingPkg.scripts.start = existingPkg.scripts.start || "node --env-file=.env dist/server.js";
        
        existingPkg.dependencies = existingPkg.dependencies || {};
        if (!existingPkg.dependencies.webrisp) {
           existingPkg.dependencies.webrisp = "latest";
        }
        
        fs.writeFileSync(pkgPath, JSON.stringify(existingPkg, null, 2));
        console.log('✅ Updated package.json');
      } catch (err) {
        console.error('❌ Failed to update package.json:', err);
      }
    }

    // 2. Create tsconfig.json
    const tsconfigPath = path.join(cwd, 'tsconfig.json');
    if (!fs.existsSync(tsconfigPath)) {
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
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      console.log('✅ Created tsconfig.json');
    }

    // 3. Create .env
    const envPath = path.join(cwd, '.env');
    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, `SECRET_KEY=super_secret_server_password_123\nWEBRISP_PUBLIC_TITLE=Welcome to HyperEdge`);
      console.log('✅ Created .env');
    }

    // 4. Create src directory and boilerplate
    const srcDir = path.join(cwd, 'src');
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
    }

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
    console.log('✅ Created src/server.ts');

    const clientTs = `import { hydrate } from 'webrisp/client';
import { Counter } from './Counter.tsx';

// Wake up the interactive island
hydrate(Counter);
`;
    fs.writeFileSync(path.join(srcDir, 'client.ts'), clientTs);
    console.log('✅ Created src/client.ts');

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
    console.log('✅ Created src/App.tsx');

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
    console.log('✅ Created src/Counter.tsx');

    console.log('\n🎉 Project initialized successfully!');
    console.log('\nNext steps:');
    console.log('  1. npm install webrisp');
    console.log('  2. npm run build');
    console.log('  3. npm run start\n');
    return;
  }

  if (command === 'build') {
    const cwd = process.cwd();
    const distDir = path.join(cwd, 'dist');
    const publicDir = path.join(distDir, 'public');

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // 1. Client Hydration Bundle (The 3.8KB Wake-Up Payload)
    console.log('📦 1/2: Compiling Client Island Engine...');
    const clientDefines = loadPublicEnvForClient(cwd);
    
    // We assume the user has an entry point for their client islands
    const clientEntry = path.join(cwd, 'src/client.ts');
    
    if (fs.existsSync(clientEntry)) {
      try {
        await esbuild.build({
          entryPoints: [clientEntry],
          bundle: true,
          minify: true,
          format: 'esm',
          outfile: path.join(publicDir, 'client.js'),
          define: clientDefines,
          jsxFactory: 'h',
          jsxFragment: 'Fragment',
          alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat',
            'react/jsx-runtime': 'preact/jsx-runtime'
          }
        });
        console.log('✅ Client bundle generated safely: /dist/public/client.js');
      } catch (e) {
        console.error('❌ Client build failed:', e);
      }
    } else {
      console.log('⏭️  No src/client.ts found. Skipping client bundle (Pure Static Mode).');
    }

    // 2. Server Bundle (The Universal Micro-Kernel)
    console.log('📦 2/2: Compiling Server Engine...');
    const serverEntry = path.join(cwd, 'src/server.ts');
    
    if (fs.existsSync(serverEntry)) {
      try {
        await esbuild.build({
          entryPoints: [serverEntry],
          bundle: true,
          platform: 'node', // Compiles down to standard JS for V8/Bun/Node
          format: 'esm',
          packages: 'external', // Don't bundle native modules like pg or sqlite
          outfile: path.join(distDir, 'server.js'),
          jsxFactory: 'h',
          jsxFragment: 'Fragment'
        });
        console.log('✅ Server bundle generated: /dist/server.js');
      } catch (e) {
        console.error('❌ Server build failed:', e);
      }
    } else {
       console.log('❌ No src/server.ts found. Ensure you have a server entry point.');
    }

    console.log('\n✅ Build Complete! Ready for HyperEdge Deployment.\n');
  } else {
    console.log('Available commands:');
    console.log('  build   - Compiles the application into a secure dual-bundle.');
  }
}

// Execute CLI unconditionally as the binary entrypoint
runCLI(process.argv.slice(2));
