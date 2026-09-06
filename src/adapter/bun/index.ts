import { Application } from '../../application';

/**
 * Webrisp Bun Adapter.
 * Provides a native binding to Bun.serve (130k+ req/sec).
 * 
 * Usage:
 * import app from './app';
 * import { serve } from '@webrisp/core/adapter/bun';
 * serve(app, { port: 3000 });
 */
export function serve(app: Application, options: { port?: number } = {}) {
  const port = options.port || 3000;
  
  // Assumes Bun is present in the global scope
  if (typeof (globalThis as any).Bun === 'undefined') {
    throw new Error('[Webrisp Bun Adapter] Bun engine is not available in the current environment.');
  }

  (globalThis as any).Bun.serve({
    port,
    fetch(request: Request) {
      return app.fetch(request);
    }
  });

  console.log(`[Webrisp HyperEdge - Bun] Listening on port ${port}`);
}
