import { h, signal } from 'webrisp/client';

const count = signal(0);

export function Counter() {
  return (
    <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: white; margin-top: 20px;">
      <h2 style="margin-top: 0;">Island Reactivity</h2>
      <p style="font-size: 1.5rem; font-weight: bold;">Count: {count.value}</p>
      <button 
        onClick={() => count.value++} 
        style="padding: 10px 20px; cursor: pointer; background: black; color: white; border: none; border-radius: 6px; font-size: 1rem;"
      >
        Increment
      </button>
      <p style="margin-top: 15px; color: gray; font-size: 0.9rem;">
        <i>Injected Public Env: {process.env.WEBRISP_PUBLIC_TITLE}</i>
      </p>
    </div>
  );
}
