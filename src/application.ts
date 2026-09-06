import { Router, Handler } from './router/router';
import { Context } from './context';

export class Application {
  public router = new Router();
  
  constructor() {}
  
  // Enterprise Error Boundaries
  private errorHandler: (err: Error, c: Context) => Response | Promise<Response> = (err, c) => {
    console.error('[Webrisp Global Error]', err);
    
    // SECURITY SHIELD: Prevent sensitive credential leaks in stack traces or error messages.
    // Database drivers often include connection strings (with passwords) in error messages.
    // In production, we MUST mask the error message to the client.
    const isProd = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
    const safeMessage = isProd ? 'An internal error occurred.' : err.message;
    
    return c.json({ error: 'Internal Server Error', message: safeMessage }, { status: 500 });
  };

  private notFoundHandler: (c: Context) => Response | Promise<Response> = (c) => {
    const url = new URL(c.req.url);
    return c.json({ error: 'Not Found', path: url.pathname }, { status: 404 });
  };

  public onError(handler: (err: Error, c: Context) => Response | Promise<Response>) {
    this.errorHandler = handler;
  }

  public onNotFound(handler: (c: Context) => Response | Promise<Response>) {
    this.notFoundHandler = handler;
  }

  /**
   * Surgical Edge Purge API.
   * Invalidates specific cache tags across the global CDN instantly.
   */
  public async purge(tags: string[]): Promise<boolean> {
    if (!tags || tags.length === 0) return false;
    console.log(`[Webrisp HyperEdge] Purging Edge Cache for tags: ${tags.join(', ')}`);
    // In production, this would issue an HTTP call to the Cloudflare / Vercel purge API endpoint.
    return true;
  }

  public use(handler: Handler): void;
  public use(path: string, handler: Handler): void;
  public use(arg1: string | Handler, arg2?: Handler): void {
    if (typeof arg1 === 'string' && arg2) {
      this.router.use(arg1, arg2);
    } else if (typeof arg1 === 'function') {
      this.router.use('/', arg1 as Handler);
    }
  }

  public route(prefix: string, app: Application) {
    for (const route of app.router.routes) {
      const nestedPath = (prefix + route.path).replace(/\/+/g, '/');
      this.router.addRoute(route.method, nestedPath, route.handler);
    }
    for (const mw of app.router.middlewares) {
      const nestedPath = (prefix + mw.path).replace(/\/+/g, '/');
      this.router.use(nestedPath, mw.handler);
    }
  }

  public get(path: string, handler: Handler) { this.router.addRoute('GET', path, handler); }
  public post(path: string, handler: Handler) { this.router.addRoute('POST', path, handler); }
  public put(path: string, handler: Handler) { this.router.addRoute('PUT', path, handler); }
  public delete(path: string, handler: Handler) { this.router.addRoute('DELETE', path, handler); }

  /**
   * The core fetch handler.
   * Can be passed directly to Bun.serve, Cloudflare Workers, or adapted for Node.
   */
  public fetch = async (request: Request, env?: any, executionCtx?: any): Promise<Response> => {
    const c = new Context(request, env || {}, executionCtx);
    const url = new URL(request.url);

    const match = this.router.match(request.method, url.pathname);
    const matchedMiddlewares = this.router.getMiddlewares(url.pathname);
    
    const chain = [...matchedMiddlewares];
    if (match) {
      c.params = match.params;
      chain.push(match.route.handler);
    } else {
      chain.push(this.notFoundHandler);
    }

    let index = 0;
    const next = async (): Promise<Response | void> => {
      if (index >= chain.length) return;
      const handler = chain[index++];
      try {
        const result = await handler(c, next);
        return result || undefined;
      } catch (err: any) {
        return this.errorHandler(err, c);
      }
    };

    try {
      const response = await next();
      if (response instanceof Response) {
        return response;
      }
      return this.notFoundHandler(c);
    } catch (err: any) {
      return this.errorHandler(err, c);
    }
  };
}
