import { h } from 'webrisp';
import { Counter } from './Counter.tsx';

export function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Webrisp Framework</title>
        <style>
          {`body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; line-height: 1.6; }`}
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
