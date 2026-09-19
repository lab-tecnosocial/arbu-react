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
pnpm start        # http://localhost:3000  (`pnpm dev` es lo mismo)
pnpm build        # genera build/
pnpm deploy       # build + firebase deploy --only hosting
pnpm deploy:rules # despliega firestore.rules (NO va en pnpm deploy)
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
    Spinner/ Skeleton/   # piezas compartidas de estado de carga
  helpers/campanias/  # modelo de campaña, registros, evaluación, ranking
  helpers/geo/        # municipios del área metropolitana (punto en polígono)
  assets/geo/         # GeoJSON de los 7 municipios (16 KB, versionado)
  actions/ reducers/ store/    # Redux (auth, mapa, catalogo, leaderboard, ...)
  selectors/        # lecturas derivadas del estado (campañas, carga de árboles)
  helpers/          # acceso a Firestore y utilidades compartidas
docs/               # notas técnicas (lecturas de Firestore, permisos de Arbu Pro)
scripts/            # utilidades puntuales (migración de permisos)
  firebase/         # inicialización de Firebase (API modular v9)
```

## Convenciones

- **Firebase**: solo la API modular v9 (`collection(db, ...)`, `getDocs`,
  `updateDoc`). No se usa `firebase/compat`.
- **Permisos**: todo sale de `usuariosAutorizados/accesoTablas` — `correos`
  (entrar al back-office), `permisos` (las áreas: `campanas`, `proyectos`,
  `tabla`, `mapeoScout`, `dashboard`) y `roles` (`superadmin` entra a todo y
  reparte accesos; `admin` es solo una etiqueta). El catálogo de áreas vive en
  `src/helpers/permisos.js` y se gestiona desde `/admin/accesos`. Ver
  [`docs/permisos-arbu-pro.md`](docs/permisos-arbu-pro.md).
- **Sesión**: el estado vive en `state.auth = { checking, user }`. `checking` es
  `true` hasta que Firebase resuelve si hay sesión; las guardias
  (`ProtectedRoute`, `PublicRoute`) esperan a que termine antes de redirigir.
- **Mapas**: todos los mapas usan `BASEMAP_URL` y `BASEMAP_ATTRIBUTION` de
  `src/helpers/basemap.js`. CARTO exige API key desde agosto de 2026, y ese
  módulo es el único sitio donde cambiarla.
- **Arbu Pro** se carga con `React.lazy` desde `App.jsx`: arrastra
  material-react-table, xlsx y swagger-ui, que no deben pesar en el bundle que
  descarga cualquier visitante.
- **Lecturas de Firestore**: Firestore cobra **por documento leído**. Nada de
  `getDocs` de una colección entera para resolver un dato suelto; se lee por id
  (`loadUsuariosPorIds`), o bajo demanda cuando la capa se enciende. El mapa
  público lee por `leerColeccionConCache`. En desarrollo, cada lectura se anota
  en consola con el prefijo `[lecturas]`. El detalle y el plan pendiente están
  en [`docs/lecturas-firestore.md`](docs/lecturas-firestore.md).
- **Estados de carga**: ninguna vista que dependa de Firestore se deja en
  blanco. Hay dos piezas compartidas, `<Spinner>` y `<Skeleton>`
  (`src/components/`), y el estado se lee de selectores derivados, nunca de
  `data.length === 0` —que no distingue "todavía no llegó" de "no hay nada".

## Estados de carga del mapa público

El mapa base se pinta en menos de un segundo, pero los árboles tardan entre tres
y cinco (dos `getDocs` de colección completa, más en red móvil). Antes ese hueco
no se señalaba de ninguna forma: el mapa vacío parecía el resultado final.

- `src/actions/mapaPublico.actions.js` — `cargarDatosMapaPublico()` agrupa las
  cinco cargas del mapa público. Es `allSettled`: que falle la de usuarios (solo
  aporta el nombre del mapeador) no puede impedir que se pinten los árboles. Al
  estar en un solo sitio, el botón "Reintentar" repite exactamente la carga
  inicial.
- `src/selectors/arboles.js` — `selectArbolesCargando`, `selectArbolesError`,
  `selectHayArbolesCargados`. Las dos capas (plantados y mapeados) son dos
  peticiones, pero para quien mira son "los árboles".
- `EstadoMapa` (junto a `MapWrapper`) — aviso flotante sobre el mapa. **Cargar
  manda sobre fallar**: si una capa ya falló pero la otra sigue en vuelo se
  muestra "Cargando", porque avisar del error antes de tiempo lo haría
  parpadear. El aviso no bloquea: se puede arrastrar y hacer zoom mientras
  tanto.
- El sidebar pone un `<Skeleton>` en el bloque Actividades mientras llegan las
  campañas, para que no aparezca de golpe y empuje el resto.

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

## Service worker, caché y "no veo mis cambios"

La app es una PWA: en producción un service worker precachea el bundle y lo
sirve desde caché. Eso es lo que hace que a veces parezca que un despliegue no
llegó, y conviene entender el reparto:

- **`pnpm start` (dev, :3000)** — sin service worker. Además, si quedaba uno
  instalado de antes, `src/index.jsx` lo desregistra y borra sus cachés: basta
  con cargar la página una vez. Es donde hay que trabajar día a día.
- **`pnpm build && pnpm serve` (preview, :4173)** — service worker real. Sirve
  para validar la PWA, y es correcto usarlo, pero recuerda que **cada puerto es
  un origen distinto con su propio service worker y su propia caché**: `:3000`,
  `:4173` y `arbu.app` pueden enseñarte tres versiones diferentes a la vez. Si
  vas a mirar preview, cierra el dev, o al menos no los compares entre sí.
- **Producción** — al desplegar, el service worker nuevo toma el control y
  `src/index.jsx` recarga la pestaña una vez, así que la versión nueva entra
  sola. Antes hacían falta dos recargas manuales.

Si aun así ves algo viejo: DevTools → Application → Clear site data. Y para
trabajar cómodo contra preview, marca "Update on reload" en Application →
Service Workers.

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
