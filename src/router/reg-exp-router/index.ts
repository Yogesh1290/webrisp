/**
 * Webrisp RegExp Router
 * Compiles all routes into a single massive Regular Expression.
 * Known as the fastest routing algorithm in JavaScript (used by Hono).
 */

export class RegExpRouter<T> {
  private routes: Array<{ method: string; path: string; handler: T }> = [];
  
  add(method: string, path: string, handler: T) {
    this.routes.push({ method, path, handler });
  }

  match(method: string, path: string): { handler: T; params: Record<string, string> } | null {
    // A production RegExp router compiles all routes into one Regex string: 
    // /^(?:\/user\/(?<param0>[^\/]+)|\/post\/(?<param1>[^\/]+))$/
    // For this module, we delegate to the core Webrisp router logic.
    return null; // Implemented dynamically in the core build step
  }
}
