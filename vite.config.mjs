import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; 

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true, // Nos permite validar el funcionamiento en localhost
        },
        workbox: {
          runtimeCaching: [
            {
              // Intercepta las imágenes de tu bucket de Firebase
              urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*?/i,
              // Usamos StaleWhileRevalidate para imágenes sin CORS (recurso opaco)
              handler: 'StaleWhileRevalidate', 
              options: {
                cacheName: 'arbu-imagenes-especies',
                expiration: {
                  maxEntries: 100, // Almacena hasta 100 árboles distintos
                  maxAgeSeconds: 60 * 60 * 24 * 30, // Conservar por 30 días en el dispositivo
                },
                cacheableResponse: {
                  //El '0' permite almacenar respuestas opacas sin CORS
                  statuses: [0, 200], 
                },
              },
            },
          ],
        },
      }),
    ],
  };
});