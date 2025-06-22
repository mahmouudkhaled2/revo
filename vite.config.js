  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import history from 'connect-history-api-fallback';

  export default defineConfig({
    plugins: [react()],
    server: {
      // middlewareMode: true,
      // proxy: {
      //   "/predict": {
      //     target: "https://comment-rating-final-production.up.railway.app",
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/predict/, "/predict"),
      //   },
      // },
    },
    configureServer: (server) => {
      server.middlewares.use(history());
    },
  });

