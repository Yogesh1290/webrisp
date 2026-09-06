import { hydrate } from 'webrisp/client';
import { Counter } from './Counter.tsx';

// Wake up the interactive island
hydrate(Counter);
