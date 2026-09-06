/**
 * Webrisp Cloudflare Workers Adapter
 * WinterCG Compliant Adapter
 */

export const handle = (app: any) => {
  return {
    async fetch(request: Request, env: any, ctx: any): Promise<Response> {
      // Translate Web Fetch -> Webrisp Request
      return app.fetch(request);
    }
  };
};
