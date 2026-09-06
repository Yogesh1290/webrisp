export { Application as Webrisp } from './application';
export { Context } from './context';
export { Router } from './router/router';
export { shield } from './shield';
export type { Handler, NextFunction } from './router/router';

// Advanced Routers
export { TrieRouter } from './router/trie-router';
export { RegExpRouter } from './router/reg-exp-router';

// Official Middlewares
export { cors } from './middleware/cors';

// Official Helpers
export { getCookie, setCookie } from './helper/cookie';
export { upgradeWebSocket } from './helper/websocket';
export { env } from './helper/env';

// Official Adapters
export * as serveNode from './adapter/node';
export * as serveCloudflare from './adapter/cloudflare-workers';
export * as serveBun from './adapter/bun';
export * as serveVercel from './adapter/vercel';

// UI / Islands Engine
export { Island } from './island';
export { hydrateIslands } from './client/hydrate';
export { defineLoader } from './loader';

// CRITICAL FRAMEWORK INDEPENDENCE:
// Re-export UI primitives directly from Webrisp so the developer never needs to 
// install or import from 'preact' or '@preact/signals'.
export { h, Component, Fragment } from 'preact';
export { signal, computed, effect } from '@preact/signals';
