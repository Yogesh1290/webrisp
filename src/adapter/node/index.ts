import { createServer } from 'http';
import { Application } from '../../application';

export function serve(app: Application, options: { port: number }) {
  const server = createServer(async (req, res) => {
    const url = `http://${req.headers.host || 'localhost'}${req.url}`;
    
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else if (value) {
        headers.append(key, value);
      }
    }

    const init: RequestInit & { duplex?: string } = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const bodyStream = new ReadableStream({
        start(controller) {
          req.on('data', chunk => controller.enqueue(chunk));
          req.on('end', () => controller.close());
          req.on('error', err => controller.error(err));
        }
      });
      init.body = bodyStream;
      init.duplex = 'half';
    }

    try {
      const request = new Request(url, init);
      const response = await app.fetch(request);

      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      if (response.body) {
        const reader = response.body.getReader();
        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                res.end();
                break;
              }
              if (value) res.write(value);
            }
          } catch (e) {
            res.end();
          }
        };
        await pump();
      } else {
        res.end();
      }
    } catch (err) {
      console.error('[Webrisp Node Adapter Error]', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(options.port, '0.0.0.0', () => {
    console.log(`[Webrisp Node Adapter] Listening on port ${options.port}`);
  });
}
