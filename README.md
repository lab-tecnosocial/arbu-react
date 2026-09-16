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

(Ya no hay `VITE_API_URL`: era la base de una API externa de la que solo colgaba
la capa de polígonos scout, que se retiró. Ver más abajo.)

## Estructura

```
src/
  pages/            # sitio público: homev, mapav (mapa nuevo), inscripcion
  components/
    navbar/ ranking/ catalogo/ api/ acerca/   # público
    admin/ dashboard/ tabla/ mapeo-scout/ proyectos/ autenticacion/  # Arbu Pro
    concurso/       # panel de campañas y concursos (Arbu Pro)
  helpers/campanias/  # modelo de campaña, registros, evaluación, ranking
  helpers/geo/        # municipios del área metropolitana (punto en polígono)
  assets/geo/         # GeoJSON de los 7 municipios (16 KB, versionado)
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


## Campañas de mapeo

Una **campaña** es una actividad de mapeo con nombre, ventana de fechas y reglas
de validez. Alimenta a la vez el selector del mapa público y el panel de Arbu
Pro. Viven en la colección `proyectos` (el nombre es histórico; el concepto se
generalizó sin migrar ningún documento) y se crean desde **Proyectos**.

- **Compatibilidad**: los documentos sin `schemaVersion` se leen con la
  semántica de siempre — la fecha del árbol es la de su primer monitoreo. Solo
  los `schemaVersion: 2` cuentan *cualquier* monitoreo dentro de la ventana.
  Todo pasa por `normalizarCampania()`; nada se migra en Firestore.
- **Qué se guarda y qué se deriva**: la pertenencia de un árbol a una campaña,
  su municipio y su validez automática se **recalculan** en cliente. Solo se
  persiste el juicio humano, en `proyectos/{id}/revisiones` y
  `proyectos/{id}/participantes`.
- **La unidad de conteo es el registro**, no el árbol: el par (árbol, monitoreo)
  que cae dentro de la ventana. Así un ejemplar mapeado por varias personas vale
  para todas —lo exigen las bases del concurso— y un árbol antiguo remonitoreado
  durante la campaña cuenta, con las fotos de *ese* monitoreo.
- **La especie no oculta nada**: el filtro público es la ventana de fechas. La
  especie decide el icono del marcador y cuenta para la validez, pero un
  jacarandá mal etiquetado sigue apareciendo en el mapa y va a la cola de
  revisión. En los datos reales abundan `nombreComun: ""` y
  `nombreCientifico: "..."`, así que descartar por especie perdería aportes.
- **Municipios**: `src/assets/geo/municipiosMetropolitanosCbba.json` (16 KB, 7
  municipios con su código INE). Va en `src/assets/` y no en `public/` para que
  pase por Rollup, se hashee y no toque el precache de la PWA. Se regeneró así:

  ```bash
  npx -y mapshaper <fuente>.geojson \
    -filter '["Sipe Sipe","Vinto","Colcapirhua","Tiquipaya","Quillacollo","Cochabamba","Sacaba"].indexOf(Municipality) > -1' \
    -each 'nombre = (Municipality === "Cochabamba" ? "Cercado" : Municipality), codigoIne = ADM3_PCODE.substr(2)' \
    -filter-fields nombre,codigoIne -clean \
    -o precision=0.00001 format=geojson src/assets/geo/municipiosMetropolitanosCbba.json
  ```

  Los bordes son una generalización: un árbol a pocos metros de un límite puede
  caer del lado equivocado. La válvula de escape es la revisión humana, no un
  buffer.

## Capa geográfica de grupos scouts (retirada)

El sidebar tenía un bloque "Geo Visualización" con Normal / OTBs / Scouts.

- **Qué era**: polígonos de triangulación por grupo scout, con un popup de los
  árboles dentro de cada zona.
- **Por qué se retiró**: el GeoJSON nunca estuvo en el repo. Se pedía a
  `${VITE_API_URL}/triangulacion_grupos_scouts.geojson`, esa variable nunca se
  definió en ningún `.env`, y el bundle desplegado pedía literalmente
  `undefined/...` — el hosting devolvía `index.html` y `res.json()` reventaba.
  La opción "OTBs" jamás llegó a implementarse: pedía el mismo archivo de
  scouts y el mapa solo sabía pintar la rama "scouts".
- **Cómo recuperarla**: poner el archivo en `public/`, cargarlo con un `fetch`
  relativo (nada de API externa) y rescatar el `<GeoJSON>` con su
  `onEachFeature` del historial. Ojo: aquella versión llamaba a `useMap()`
  dentro de `onEachFeature`, que es un hook fuera de componente y habría
  reventado igualmente.

## Mapeo desde la web (pendiente)

`TreeMappingForm` se retiró: era inalcanzable (su botón llevaba tiempo
comentado) y escribía a `mapeos_test` con un esquema incompatible con
`arbolesMapeados` —`lugarPlantacion` en vez de `lugarDePlantacion`, `diametro`
suelto, `fechaCreacion`— y **sin latitud, longitud ni `mapeadoPor`**. Aunque se
reactivara, produciría documentos que el mapa no puede pintar ni atribuir a
nadie. Para revivirlo hay que escribir en `arbolesMapeados` con el esquema real
(incluido el envoltorio `monitoreos`) y añadir su regla de Firestore.

## Imágenes y caché

Las fotos de los árboles viven en Firebase Storage y se piden sin CORS, así que
el service worker solo ve respuestas opacas. Por eso se cachean con
`NetworkFirst` (`vite.config.mjs`): con `StaleWhileRevalidate` una descarga
fallida se guardaba como si fuera válida y la foto quedaba rota durante 30 días
en ese dispositivo. Ante un reporte de "no se ven las fotos", el primer paso es
limpiar los datos del sitio.

## Privacidad

El mapa público consume de `inscripcionesMapeo` **solo** `{id, grupo, rama}`, vía
`loadInscripcionesMapeoPublic()`. Es una lista blanca explícita: no añadir
campos ahí sin pensarlo. El nombre y el email de los scouts no salen del
back-office.
