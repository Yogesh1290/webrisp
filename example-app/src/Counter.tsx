import { h, signal } from 'webrisp/client';

const count = signal(0);

export function Counter() {
  return (
    <div style="padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
      <h2>Island Reactivity</h2>
      <p>Count: {count.value}</p>
      <button onClick={() => count.value++} style="padding: 8px 16px; cursor: pointer; background: black; color: white;">
        Increment
      </button>
      <p style="margin-top: 15px; color: gray;">
        <i>Injected Public Env: {process.env.WEBRISP_PUBLIC_TITLE}</i>
      </p>
    </div>
  );
}
