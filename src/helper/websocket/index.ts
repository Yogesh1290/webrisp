/**
 * Webrisp WebSocket Engine
 * Provides a standardized way to upgrade HTTP requests to WebSocket connections
 * across different adapters (Node, Cloudflare, etc.)
 */
export const upgradeWebSocket = (handler: (ws: any) => void) => {
  return async (c: any, next: any) => {
    // Adapter-specific WebSocket upgrade injection
    if (c.req.raw.headers.upgrade?.toLowerCase() === 'websocket') {
      // In a full implementation, this triggers the specific underlying
      // runtime (like Node's 'upgrade' event or Cloudflare's new WebSocketPair)
      c.set('websocket_handler', handler);
      return c.res.status(101).send('Switching Protocols');
    }
    await next();
  };
};
