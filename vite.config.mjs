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
              // NetworkFirst, no StaleWhileRevalidate, y el motivo importa:
              // estas imágenes se piden sin CORS, así que el service worker solo
              // ve respuestas OPACAS (status 0). Una opaca no distingue una foto
              // correcta de una descarga fallida, y con StaleWhileRevalidate una
              // opaca rota se quedaba cacheada hasta 30 días: el usuario veía la
              // foto rota para siempre, sin forma de recuperarla salvo limpiar
              // los datos del sitio. Pasó de verdad, con las fotos del concurso.
              //
              // Con NetworkFirst la red manda siempre que la haya, y la caché
              // queda solo como respaldo sin conexión, que era su propósito.
              handler: 'NetworkFirst',
              options: {
                cacheName: 'arbu-imagenes-especies',
                networkTimeoutSeconds: 6,
                expiration: {
                  maxEntries: 100, // Almacena hasta 100 árboles distintos
                  maxAgeSeconds: 60 * 60 * 24 * 30, // Conservar por 30 días en el dispositivo
                },
                cacheableResponse: {
                  // El '0' permite almacenar respuestas opacas sin CORS.
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