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
          // Desactivado a propósito. Con el service worker activo en `pnpm start`
          // el navegador sirve una mezcla de código nuevo y cacheado, y uno acaba
          // depurando un bug que ya no existe. La PWA se valida donde es real:
          // `pnpm build && pnpm serve`, o directamente en producción.
          enabled: false,
        },
        workbox: {
          // Lo pesado que solo usan unas pocas pantallas NO se precachea.
          // El precache se descarga entero antes de que el service worker nuevo
          // pueda activarse: cuanto más pesa, más tarda un despliegue en verse
          // —la app sigue sirviendo la versión vieja mientras tanto— y más
          // datos gasta alguien que solo entra a mirar el mapa. `swagger-ui`
          // es la documentación de la API y `xlsx` la importación de planillas
          // del back-office: quien las abre se las descarga entonces, y
          // `runtimeCaching` se las guarda para la próxima.
          globIgnores: ['**/swagger-ui-*.js', '**/xlsx-*.js'],
          runtimeCaching: [
            {
              // Los chunks que quedaron fuera del precache. Llevan hash en el
              // nombre, así que una respuesta cacheada nunca es "vieja": o es
              // ese archivo exacto, o es otro nombre.
              urlPattern: ({ url, sameOrigin }) =>
                sameOrigin && url.pathname.startsWith('/assets/'),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'arbu-chunks',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: { statuses: [200] },
              },
            },
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