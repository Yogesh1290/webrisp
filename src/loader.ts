import { Context } from './context';

/**
 * Webrisp Type-Safe Data Loader
 * 
 * Enforces end-to-end type safety between server database fetches and client Islands.
 * The return type of this loader is automatically inferred by the client.
 */
export function defineLoader<T>(handler: (c: Context) => Promise<T> | T): (c: Context) => Promise<T> {
  return async (c: Context) => {
    return handler(c);
  };
}
