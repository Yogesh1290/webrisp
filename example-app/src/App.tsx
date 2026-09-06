import { h } from 'webrisp';
import { Counter } from './Counter.tsx';

export function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Webrisp Dogfooding</title>
        <style>
          {`body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; }`}
        </style>
      </head>
      <body>
        <h1>⚡ Webrisp Example Application</h1>
        <p>This page is rendered entirely on the server. The interactive counter below is a hydrated Preact Island.</p>
        <div id="webrisp-root">
          <Counter />
        </div>
        <script type="module" src="/public/client.js"></script>
      </body>
    </html>
  );
}
