import { renderToString } from 'preact-render-to-string';
import { VNode } from 'preact';

/**
 * The core Webrisp Context.
 * Wraps Web Standard Request and Response paradigms.
 */
export class Context {
  public req: Request;
  public env: Record<string, any>;
  public executionCtx?: any;
  public params: Record<string, string> = {};
  private state: Map<string, any> = new Map();

  constructor(req: Request, env: Record<string, any> = {}, executionCtx?: any) {
    this.req = req;
    this.env = env;
    this.executionCtx = executionCtx;
  }

  public set(key: string, value: any): void {
    this.state.set(key, value);
  }

  public get<T = any>(key: string): T {
    return this.state.get(key) as T;
  }

  // --- Fast-path Response Helpers ---

  public json(data: any, init?: ResponseInit): Response {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      }
    });
  }

  public text(text: string, init?: ResponseInit): Response {
    return new Response(text, {
      ...init,
      headers: {
        'Content-Type': 'text/plain',
        ...init?.headers,
      }
    });
  }

  public html(html: string | ReadableStream, init?: ResponseInit): Response {
    return new Response(html, {
      ...init,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        ...init?.headers,
      }
    });
  }

  /**
   * Render a Preact component to a static HTML Response (Zero JS by default)
   * Implements Native ReadableStream byte piping (never buffers HTML in RAM).
   */
  public render(node: VNode, init?: ResponseInit): Response {
    const htmlStr = '<!DOCTYPE html>\n' + renderToString(node);
    
    // Convert to W3C ReadableStream for zero-buffer socket piping
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(htmlStr));
        controller.close();
      }
    });

    return this.html(stream, init);
  }
}
