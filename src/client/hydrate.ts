import { hydrate, h, ComponentType } from 'preact';

/**
 * Webrisp Client Hydrator (The 3.8KB Wake-Up Script)
 * 
 * This script runs in the browser. It scans the static HTML delivered by the server
 * for <webrisp-island> tags, parses their serialized props, and selectively hydrates
 * ONLY the interactive components.
 * 
 * @param islands A registry mapping island names to their actual Preact components.
 */
export function hydrateIslands(islands: Record<string, ComponentType<any>>) {
  if (typeof window === 'undefined') return;

  const islandNodes = document.querySelectorAll('webrisp-island');
  
  islandNodes.forEach((node) => {
    const name = node.getAttribute('data-island');
    const propsRaw = node.getAttribute('data-props');
    const strategy = node.getAttribute('data-strategy') || 'load';
    
    if (name && islands[name]) {
      const Component = islands[name];
      const props = propsRaw ? JSON.parse(propsRaw) : {};
      
      const hydrateNode = () => hydrate(h(Component, props), node as HTMLElement);

      // Strategy: Visible (Intersection Observer) - only hydrate when scrolled into view
      if (strategy === 'visible' && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            hydrateNode();
            observer.disconnect();
          }
        });
        observer.observe(node);
      } 
      // Strategy: Idle (Request Idle Callback) - hydrate when main thread is free
      else if (strategy === 'idle' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => hydrateNode());
      } 
      // Strategy: Load (Default) - hydrate immediately
      else {
        hydrateNode();
      }
    }
  });
}
