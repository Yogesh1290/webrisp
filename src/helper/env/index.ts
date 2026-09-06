import { Context } from '../../context';

/**
 * Webrisp Cross-Platform Env Loader
 * Reads environment variables seamlessly across Node.js (`process.env`)
 * and Cloudflare Workers/Edge (`c.env`).
 */
export const env = <T extends Record<string, string>>(c: Context): T => {
  // SECURITY SHIELD: Prevent server environment variables from leaking to the client.
  // If a developer accidentally imports this into an Island (browser code), hard crash.
  if (typeof window !== 'undefined') {
    throw new Error('[Webrisp Security Breach] Attempted to access server environment variables in the browser. Use WEBRISP_PUBLIC_ prefix for client-side variables.');
  }

  const envObj: any = {};
  
  // 1. Fallback to Node.js/Bun process.env
  if (typeof process !== 'undefined' && process.env) {
    Object.assign(envObj, process.env);
  }
  
  // 2. Cloudflare/Edge Context bindings take precedence
  if (c.env) {
    Object.assign(envObj, c.env);
  }
  
  return envObj as T;
};
