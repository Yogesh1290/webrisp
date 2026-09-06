import { Application } from '../../application';

/**
 * Webrisp Vercel (Edge & Serverless) Adapter.
 * 
 * Usage:
 * import app from './app';
 * import { handle } from '@webrisp/core/adapter/vercel';
 * 
 * export const GET = handle(app);
 * export const POST = handle(app);
 * export const PUT = handle(app);
 * export const DELETE = handle(app);
 */
export function handle(app: Application) {
  return async (request: Request) => {
    return app.fetch(request);
  };
}
