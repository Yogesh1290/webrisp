import { h, ComponentChildren, VNode } from 'preact';

export interface IslandProps {
  children: ComponentChildren;
  name: string;
  props?: Record<string, any>;
  strategy?: 'load' | 'visible' | 'idle';
}

/**
 * Webrisp Island Architecture Component.
 * Marks a subtree of the application to be hydrated with the 3.8KB client runtime.
 * All other components outside an Island are stripped of JS completely.
 */
export function Island({ children, name, props = {}, strategy = 'load' }: IslandProps) {
  // During SSR, we render a custom tag that holds the serialization information
  // required to wake up (hydrate) this component on the client.
  return h(
    'webrisp-island',
    {
      'data-island': name,
      'data-props': JSON.stringify(props),
      'data-strategy': strategy,
    },
    children
  );
}
