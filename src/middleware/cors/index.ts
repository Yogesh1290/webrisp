/**
 * Cross-Origin Resource Sharing (CORS) Middleware
 */

import { Context } from '../../context';
import { NextFunction } from '../../router/router';

type CORSOptions = {
  origin?: string;
  allowMethods?: string[];
  allowHeaders?: string[];
  credentials?: boolean;
};

export const cors = (options?: CORSOptions) => {
  const opts = {
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    ...options
  };

  return async (c: Context, next: NextFunction): Promise<Response | void> => {
    if (c.req.method === 'OPTIONS') {
      const res = new Response(null, { status: 204 });
      res.headers.set('Access-Control-Allow-Origin', opts.origin);
      res.headers.set('Access-Control-Allow-Methods', opts.allowMethods.join(','));
      if (opts.credentials) {
        res.headers.set('Access-Control-Allow-Credentials', 'true');
      }
      return res;
    }

    const res = await next();
    if (res instanceof Response) {
      const cloned = new Response(res.body, res);
      cloned.headers.set('Access-Control-Allow-Origin', opts.origin);
      if (opts.credentials) {
        cloned.headers.set('Access-Control-Allow-Credentials', 'true');
      }
      return cloned;
    }
  };
};
