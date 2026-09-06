import { hydrate as preactHydrate, h, Component, Fragment } from 'preact';
import { signal, computed, effect } from '@preact/signals';

/**
 * Webrisp Client Hydration Engine
 * Used exclusively for browser bundles.
 */

export function hydrate(App: any) {
  const root = document.getElementById('webrisp-root');
  if (root) {
    preactHydrate(h(App, null), root);
  } else {
    console.warn('[Webrisp] Could not find #webrisp-root to hydrate.');
  }
}

// Re-export UI primitives so client code imports from "webrisp/client"
export { h, Component, Fragment, signal, computed, effect };
