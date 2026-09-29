import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

// En local, exécute les fonctions de /api comme le ferait Vercel.
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        let path = req.url.split('?')[0];
        if (path === '/calendar.ics') path = '/api/calendar';
        if (!path.startsWith('/api/') || path.includes('/_') || path.includes('..')) return next();
        const file = resolve(root, `.${path}.js`);
        if (!existsSync(file)) return next();
        try {
          const { default: handler } = await server.ssrLoadModule(file);
          await handler(req, res);
        } catch (error) {
          console.error(error);
          res.statusCode = 500;
          res.end('{"error":"server_error"}');
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, root, ''));
  return {
    plugins: [localApi()],
    build: {
      rollupOptions: {
        input: { main: resolve(root, 'index.html'), admin: resolve(root, 'admin.html') }
      }
    }
  };
});
