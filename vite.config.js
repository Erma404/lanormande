import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import { content } from './src/content.js';
import { applyOverrides } from './src/content-overrides.js';
import { renderPage } from './src/page.js';
import { headTags } from './src/seo.js';
import { SITE_URL } from './src/site.js';

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

// Génère le HTML complet de chaque langue (/ et /en) : les moteurs de recherche et les aperçus
// de partage voient tout le contenu, et la page s'affiche avant même le chargement du JavaScript.
function prerender() {
  let isBuild = false;
  return {
    name: 'prerender',
    configResolved(config) { isBuild = config.command === 'build'; },
    async buildStart() {
      if (!isBuild) return;
      // Intègre au build les textes modifiés depuis l'admin (site en ligne), si disponibles.
      try {
        const response = await fetch(`${SITE_URL}/api/content`, { signal: AbortSignal.timeout(5000) });
        if (response.ok) applyOverrides(content, await response.json());
      } catch { /* build hors ligne : textes par défaut */ }
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (!html.includes('<!--app-->')) return html;
        const lang = ctx.path.startsWith('/en') ? 'en' : 'fr';
        const t = content[lang];
        const state = { arrivalText: t.booking.select, departureText: t.booking.select, guestSummary: `2 ${t.booking.adultWord(2)}`, adults: 2, children: 0, activeFloor: 'ground' };
        return html.replace('<!--seo-->', headTags(lang, t)).replace('<!--app-->', renderPage(t, state));
      }
    }
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, root, ''));
  return {
    plugins: [localApi(), prerender()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(root, 'index.html'),
          en: resolve(root, 'en/index.html'),
          admin: resolve(root, 'admin.html'),
          notFound: resolve(root, '404.html')
        }
      }
    }
  };
});
