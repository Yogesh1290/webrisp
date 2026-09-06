import { Context } from './context';
import { NextFunction } from './router/router';

const singleFlightLocks = new Map<string, Promise<Response>>();

/**
 * Resource Shield Middleware.
 * Prevents Cache Stampedes using Single-Flight request coalescing.
 * When multiple identical requests arrive at the same time, only ONE
 * actually executes the handler. The rest wait and clone the response.
 */
export const shield = (options?: { tags?: string[] }) => {
  return async (c: Context, next: NextFunction): Promise<Response | void> => {
    // Only apply single-flight to GET requests
    if (c.req.method !== 'GET') {
      return next();
    }

    const key = c.req.url;

    // 1. If another request is currently processing this exact URL, wait for it.
    if (singleFlightLocks.has(key)) {
      const lockedPromise = singleFlightLocks.get(key)!;
      try {
        const res = await lockedPromise;
        return res.clone();
      } catch (err) {
        // If the locked request failed, we just fall through and try again.
      }
    }

    // 2. Otherwise, acquire the lock for this URL
    const lock = (async () => {
      const res = await next();
      if (!res) {
        throw new Error('No response returned from handler');
      }

      // 3. Inject Immutable Cache Headers and Edge Tags
      // This enforces the "Infinite Cache TTL" pillar.
      const headers = new Headers(res.headers);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      
      if (options?.tags && options.tags.length > 0) {
        // Cache-Tag for Fastly/Cloudflare/Vercel
        headers.set('Cache-Tag', options.tags.join(','));
      }

      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers,
      });
    })();

    // 3. Store the promise in the lock map
    singleFlightLocks.set(key, lock);

    try {
      const finalResponse = await lock;
      // 4. Return a clone for the first request
      return finalResponse.clone();
    } finally {
      // 5. Cleanup the lock once the single-flight cycle is done
      singleFlightLocks.delete(key);
    }
  };
};
