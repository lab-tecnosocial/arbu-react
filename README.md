# Arbu Web

Versión web de la app Arbu, para el cuidado del arbolado urbano de Cochabamba.

El sitio tiene dos mitades:

- **Arbu** (público): home, mapa de árboles, ranking, sección Aprende (catálogo de
  especies, guía de selección y guía de plantación), documentación de la API e
  inscripción a mapeos.
- **Arbu Pro** (back-office, requiere sesión y autorización): panel de admin,
  tabla editable de árboles mapeados, mapeo scout con exportación a Excel y
  gestión de proyectos.

## Requisitos

- Node 22 (vía nvm)
- pnpm (vía corepack). No uses `npm install` ni `yarn`: el proyecto se instala
  con `pnpm install` y su lockfile es `pnpm-lock.yaml`.

## Puesta en marcha

```bash
pnpm install
pnpm start     # http://localhost:3000
pnpm build     # genera build/
pnpm deploy    # build + firebase deploy --only hosting
```

## Variables de entorno

Van en un `.env` en la raíz (no versionado). Todas se inlinean en el bundle, así
que ninguna es secreta.

| Variable | Para qué |
| --- | --- |
| `VITE_API_KEY`, `VITE_AUTH_DOMAIN`, `VITE_DATABASE_URL`, `VITE_PROJECT_ID`, `VITE_STORAGE_BUCKET`, `VITE_MESSAGING_SENDER_ID`, `VITE_APP_ID`, `VITE_MEASUREMENT_ID` | Configuración del proyecto de Firebase |
| `VITE_API_URL` | Base de la API de Arbu. De ahí salen las capas geográficas del mapa (`triangulacion_grupos_scouts.geojson`). Sin ella, las vistas "Scouts" y "OTBs" del mapa quedan vacías. |

## Estructura

```
src/
  pages/            # sitio público: homev, mapav (mapa nuevo), inscripcion
  components/
    navbar/ ranking/ catalogo/ api/ acerca/   # público
    admin/ dashboard/ tabla/ mapeo-scout/ proyectos/ autenticacion/  # Arbu Pro
  actions/ reducers/ store/    # Redux (auth, mapa, catalogo, leaderboard, ...)
  helpers/          # acceso a Firestore y utilidades compartidas
  firebase/         # inicialización de Firebase (API modular v9)
```

## Convenciones

- **Firebase**: solo la API modular v9 (`collection(db, ...)`, `getDocs`,
  `updateDoc`). No se usa `firebase/compat`.
- **Sesión**: el estado vive en `state.auth = { checking, user }`. `checking` es
  `true` hasta que Firebase resuelve si hay sesión; las guardias
  (`ProtectedRoute`, `PublicRoute`) esperan a que termine antes de redirigir.
- **Mapas**: todos los mapas usan `BASEMAP_URL` y `BASEMAP_ATTRIBUTION` de
  `src/helpers/basemap.js`. CARTO exige API key desde agosto de 2026, y ese
  módulo es el único sitio donde cambiarla.
- **Arbu Pro** se carga con `React.lazy` desde `App.jsx`: arrastra
  material-react-table, xlsx y swagger-ui, que no deben pesar en el bundle que
  descarga cualquier visitante.
