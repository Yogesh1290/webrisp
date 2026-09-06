import { Context } from '../context';

export type NextFunction = () => Promise<Response | void>;
export type Handler = (c: Context, next: NextFunction) => Response | Promise<Response | void> | void;

export interface RouteNode {
  method: string;
  path: string;
  pattern: RegExp;
  paramNames: string[];
  handler: Handler;
}

export class Router {
  public routes: RouteNode[] = [];
  public middlewares: Array<{ path: string; pattern: RegExp; handler: Handler }> = [];

  public use(path: string, handler: Handler) {
    // Convert path prefix to wildcard regex. e.g. /api -> ^/api.*
    const regexPath = path === '/' ? '.*' : path.replace(/:([^\/]+)/g, '([^/]+)') + '.*';
    this.middlewares.push({
      path,
      pattern: new RegExp(`^${regexPath}`),
      handler
    });
  }

  public addRoute(method: string, path: string, handler: Handler) {
    const paramNames: string[] = [];
    const regexPath = path.replace(/:([^\/]+)/g, (_, key) => {
      paramNames.push(key);
      return '([^/]+)';
    });
    
    this.routes.push({
      method,
      path,
      pattern: new RegExp(`^${regexPath}$`),
      paramNames,
      handler
    });
  }

  public match(method: string, pathname: string): { route: RouteNode; params: Record<string, string> } | null {
    for (const route of this.routes) {
      if (route.method === method || route.method === 'ALL') {
        const match = pathname.match(route.pattern);
        if (match) {
          const params: Record<string, string> = {};
          route.paramNames.forEach((name, i) => {
            params[name] = match[i + 1];
          });
          return { route, params };
        }
      }
    }
    return null;
  }
  
  public getMiddlewares(pathname: string): Handler[] {
    return this.middlewares
      .filter(m => m.pattern.test(pathname))
      .map(m => m.handler);
  }
}
