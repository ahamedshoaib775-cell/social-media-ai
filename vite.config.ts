import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import instagramHandler from './api/instagram.ts'

// Custom Vite plugin to handle server-side /api/instagram endpoints during local dev
function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/instagram')) {
          try {
            await instagramHandler(req, res);
          } catch (err: any) {
            console.error('[API Middleware Error]', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err?.message || 'Server API Error' }));
          }
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiServerPlugin()],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
})


