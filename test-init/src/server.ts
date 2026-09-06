import { Webrisp, serveNode, h } from 'webrisp';
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
