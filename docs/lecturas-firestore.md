# Lecturas de Firestore en el mapa público

Estado: **opción A implementada** (16/09/2026). La opción B queda descrita aquí
para implementarla más adelante.

## El problema

El mapa público leía **colecciones enteras en cada visita**. Entrar a `/mapa`
costaba 6.236 lecturas de Firestore:

| Colección | Docs | Para qué se usaba |
| --- | ---: | --- |
| `arbolesMapeados` | 3.153 | pintar marcadores |
| `arbolesPlantados` | 1.632 | pintar marcadores |
| `usuarios_public` | 1.255 | resolver **uno o dos nombres** al abrir una ficha |
| `inscripcionesMapeo` | 196 | escudo scout de la capa de mapeados (apagada al entrar) |
| **Total** | **6.236** | ~12 MB sin comprimir (~1,1 MB gzip) |

Dos consecuencias:

- **Tiempo**: 3-5 s hasta ver el primer árbol (más en red móvil). Es el hueco
  que tapa el aviso "Cargando árboles…" (ver README, *Estados de carga*).
- **Coste**: Firestore cobra **por documento leído**, no por bytes. En los 14
  días previos al cambio el proyecto hizo entre 10.767 y 697.933 lecturas
  diarias, y **seis de esos catorce días pasaron de las 50.000 gratuitas**. En
  dinero era poco (~1-2 $/mes, contando también la app móvil y Arbu Pro), pero
  crece lineal con las visitas: a 1.000 visitas/día el mapa solo serían ~6M
  lecturas diarias.

El dato que ordena todo lo demás: de esos 2,5 KB por documento, el mapa **solo
necesita `id`, `latitud`, `longitud` y la especie** para pintar. Los 4.785
árboles con esos campos ocupan **290 KB, 120 KB comprimidos**. El resto
—`monitoreos` con sus fotos, observaciones y fechas— solo hace falta cuando
alguien abre la ficha de *un* árbol.

## Cómo medir esto otra vez

**Cuántos documentos hay** (sin SDK, sin credenciales; funciona porque esas
colecciones son de lectura pública):

```bash
curl -s -X POST "https://firestore.googleapis.com/v1/projects/arbu-c574d/databases/(default)/documents:runAggregationQuery" \
  -H "Content-Type: application/json" \
  -d '{"structuredAggregationQuery":{"structuredQuery":{"from":[{"collectionId":"arbolesMapeados"}]},"aggregations":[{"alias":"n","count":{}}]}}'
```

(En zsh, escribe la URL entera: `$BASE:runAggregationQuery` se rompe, porque
`:r` es un modificador de expansión del shell.)

**Cuántas lecturas se están facturando** (Cloud Monitoring, con una cuenta con
acceso al proyecto):

```bash
TOKEN=$(gcloud auth print-access-token)
curl -s -H "Authorization: Bearer $TOKEN" -G \
  "https://monitoring.googleapis.com/v3/projects/arbu-c574d/timeSeries" \
  --data-urlencode 'filter=metric.type="firestore.googleapis.com/document/read_count"' \
  --data-urlencode "interval.startTime=$(date -u -v-14d +%Y-%m-%dT%H:%M:%SZ)" \
  --data-urlencode "interval.endTime=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --data-urlencode "aggregation.alignmentPeriod=86400s" \
  --data-urlencode "aggregation.perSeriesAligner=ALIGN_SUM" \
  --data-urlencode "aggregation.crossSeriesReducer=REDUCE_SUM"
```

**Qué lee cada pantalla, mientras programas**: en desarrollo, cada lectura se
anota en la consola del navegador. Filtra por `[lecturas]`:

```
[lecturas] arbolesPlantados: 1632 docs (caché)
[lecturas] arbolesMapeados: 3153 docs (caché)
[lecturas] proyectos (campañas públicas): 2 docs (servidor)
```

Lo imprime `anotarLecturas()` en `src/helpers/leerColeccion.js`, solo con
`import.meta.env.DEV`. Si añades un loader nuevo, anótalo ahí también: el coste
de una pantalla debe verse mientras se escribe, no en la factura.

## Opción A — lo que ya está hecho

Cuatro cambios, ninguno toca la arquitectura.

### 1. Los usuarios, por id y al abrir la ficha

`loadUsuariosPorIds(ids)` (`src/helpers/loadUsuarios.jsx`) pide solo los uid que
hacen falta, en lotes de 30 (el máximo de la cláusula `in` de Firestore).
`CardTree` reúne los ids del árbol abierto —quién lo adoptó, quién hizo cada
monitoreo— y despacha `asegurarUsuarios(ids)`, que descarta los que ya están en
`state.mapa.usuariosMap`.

`usuariosMap` (diccionario id → usuario) es el contrato: lo leen la ficha y el
ranking. La acción `mapaAddUsuarios` **fusiona**, no reemplaza, porque los
usuarios ahora llegan de a poco.

− 1.255 lecturas por visita.

### 2. Las inscripciones, al encender la capa de mapeados

Solo sirven para el escudo scout de los árboles mapeados, y esa capa está
apagada al entrar. `mostrarArbolesMapeados(visible)` enciende la capa y, si
procede, dispara `asegurarInscripcionesMapeo()` —que no hace nada si ya están—.
Lo usan el chip del sidebar y la selección de campaña, así que ninguno de los
dos tiene que acordarse de pedirlas.

− 196 lecturas por visita (se piden una vez, y solo si hace falta).

### 3. No recargar lo que ya está en el store

`fetchPlantedTrees`, `fetchMappedTrees` y `fetchCampaniasPublicas` salen sin
hacer nada si su slice ya tiene datos y no hubo error. Volver al mapa desde
Ranking pasó de 6.236 lecturas a **cero**. El botón "Reintentar" del mapa pasa
`{ forzar: true }` para saltarse la guardia.

### 4. Caché persistente con ventana de frescura

`src/firebase/firebase-config.js` inicializa Firestore con
`persistentLocalCache` + `persistentMultipleTabManager` (IndexedDB), con
fallback a la instancia normal si el navegador no lo permite —Safari en
privado, almacenamiento bloqueado—.

`leerColeccionConCache()` (`src/helpers/leerColeccion.js`) decide así:

- copia en caché **reciente** (< 30 min, marca en `localStorage`) → se usa y
  **no se toca el servidor**: cero lecturas;
- copia en caché **vieja** → se pinta igual al instante y el servidor se
  consulta por detrás; `alRefrescar` mete los datos nuevos en el store;
- sin copia → se espera al servidor, como siempre.

El precio es explícito: **el mapa puede mostrar datos de hasta 30 minutos
antes**. Para un mapa de árboles es un intercambio bueno.

La ventana **no es el valor por defecto**: `leerColeccionConCache` sin
`frescuraMs` consulta siempre al servidor. Solo los thunks del mapa público
pasan `FRESCURA_MAPA_PUBLICO_MS`. Así el panel del concurso y el resto de Arbu
Pro —que usan `loadArbolesMapeados()` para revisar registros— no heredan en
silencio datos de hace media hora: ahí la caché solo sirve para pintar rápido
mientras llega lo fresco.

### Resultado medido

| Escenario | Antes | Ahora |
| --- | ---: | ---: |
| Primera visita (caché vacía) | 6.236 | **4.787** |
| Recarga dentro de los 30 min | 6.236 | **2** |
| Volver al mapa desde otra ruta | 6.236 | **0** |
| Abrir la ficha de un árbol | 0 | 1-3 |
| Encender la capa de mapeados | 0 | 196 (una vez) |

### Hallazgo: el cuello de botella se mudó

Con A implementado, medido en producción con todo limpio y otra vez en la
segunda visita:

| | Primera visita | Segunda visita (caché) |
| --- | ---: | ---: |
| Hasta ver los primeros árboles | ~6,0 s | ~5,3 s |

El tiempo bajó mucho menos que las lecturas, y la instrumentación dice por qué:

```
[lecturas] arbolesPlantados: 1632 docs (caché) en 268 ms
[lecturas] arbolesMapeados: 3153 docs (caché) en 523 ms
```

Los datos están en el store en menos de un segundo, y el bundle entra en 71 ms
desde el service worker. **Los cuatro segundos que quedan son el render**: 4.785
marcadores como componentes de react-leaflet, más el agrupado del cluster.

Esto cambia lo que hay que esperar de la opción B: bajará las lecturas a cero y
la descarga a ~120 KB, pero **no** arreglará sola el tiempo hasta ver el mapa.
La pieza que falta para eso es pintar los marcadores como capa imperativa sobre
canvas en vez de como componentes React —el patrón habitual cuando son miles—.
Conviene hacer las dos cosas, y medir cada una por separado.

## Pendiente barato, fuera del alcance de A

- **El ranking lee `usuarios_public` entera** (1.255 docs por visita a
  `/ranking`, vía `startLoadingUsuarios`) cuando solo pinta el top. Mismo
  patrón que el punto 1: pedir los uid del top con `loadUsuariosPorIds`.
- **`selectCampaniasActivas` / `selectCampaniasPasadas` no están memoizados** y
  Redux avisa en consola: devuelven un array nuevo en cada llamada. No es coste
  de Firestore, es repintado.
- **El panel del concurso lee las dos colecciones de árboles** desde que una
  campaña también cuenta lo registrado desde iOS, que llega por
  `arbolesPlantados` (19/09/2026): ~3.200 docs de `arbolesMapeados` + ~1.600 de
  `arbolesPlantados` por cada recarga del panel. Arbu Pro lee fresco a
  propósito, así que aquí no cabe la ventana de frescura del mapa público; lo
  que sí cabe, si molesta, es que el panel pida los plantados solo cuando la
  campaña esté abierta y no en cada `recargar()`. El mapa público no cambia:
  ya cargaba las dos capas.

## Opción B — el artefacto estático del mapa (por hacer)

El techo de A es claro: la **primera** visita de cada persona sigue costando
4.785 lecturas y varios segundos. Mientras el listado del mapa salga de una
base que cobra por documento, ese número no baja. La salida es no pedirle a
Firestore el listado.

### Idea

Un archivo con los 4.785 árboles y **solo los campos que el mapa pinta y
filtra**, servido como archivo estático desde el CDN de Firebase Hosting. La
ficha de un árbol pasa a ser un `getDoc` puntual —una lectura— cuando alguien
hace clic.

```
GET /datos/arboles.json     →  ~290 KB  (120 KB con gzip del CDN)
                               0 lecturas de Firestore
```

Formato sugerido (array de arrays, no de objetos: quita el 40% del peso en
claves repetidas):

```json
{
  "version": 3,
  "generado": "2026-09-16T23:00:00Z",
  "campos": ["id", "lat", "lng", "nombreCientifico", "fecha", "capa"],
  "arboles": [["02SjPr…", -17.412705, -66.157149, "Erythrina falcata", 1725926400, "p"]]
}
```

`fecha` es la del monitoreo más antiguo, ya resuelta con `fechaArbol.js` en la
generación: hoy ese cálculo lo repite cada navegador en cada visita.

### Cómo se regenera

Una Cloud Function con disparador `onWrite` sobre `arbolesPlantados` y
`arbolesMapeados`, con *debounce* (agrupar cambios y reescribir como mucho cada
N minutos), o un Cloud Scheduler cada hora. Lee las colecciones una vez por
regeneración —no una vez por visitante— y sube el archivo a Hosting o a
Storage.

Alternativa sin Functions (opción C de la conversación original): guardar el
mismo agregado en un documento de Firestore (`agregados/mapa`, cabe bajo el
límite de 1 MB) y regenerarlo con un botón en Arbu Pro. Una lectura por visita
en vez de cero, y depende de que alguien lo dispare.

### Qué cambia en el cliente

- `loadArboles` / `loadArbolesMapeados` pasan a hacer `fetch` del archivo (la
  caché del navegador y el service worker hacen el resto; ojo con el
  `NetworkFirst` del SW y con versionar la URL).
- La ficha (`CardTree`) necesita el documento completo: `getDoc(arbolesX/{id})`
  al abrirla, cacheado en el store. Es el único sitio donde hacen falta
  `monitoreos`, fotos y riegos.
- El filtro del sidebar sigue funcionando igual si el archivo trae los campos
  que filtra: especie, fecha, y lo que haga falta de categoría y riego. **Eso
  hay que decidirlo antes de fijar el formato** — revisar `treeFilters.js`.

### Qué gana y qué cuesta

| | Hoy (con A) | Con B |
| --- | ---: | ---: |
| Lecturas, primera visita | 4.787 | ~0 |
| Descarga | ~1,1 MB gzip | ~120 KB |
| Tiempo hasta ver árboles | ~6 s | sigue mandando el render (ver *Hallazgo*) |

Cuesta una función que mantener, algo de retraso en la frescura, y aceptar que
el mapa y la ficha leen de sitios distintos. A cambio, el coste deja de crecer
con las visitas: pasa a depender de **cuánto cambian los datos**, no de cuánta
gente los mira.

### Plan por pasos

1. Fijar los campos con `treeFilters.js` delante, y congelar el formato.
2. Escribir el generador como script local que sube a Hosting, y verificar el
   mapa contra el archivo (sin tocar Firestore para el listado).
3. Convertirlo en Cloud Function con disparador y debounce.
4. Pasar la ficha a `getDoc` puntual.
5. Medir otra vez con `[lecturas]` y con Cloud Monitoring, y anotar el
   resultado aquí.

## Lo que se descartó, y por qué

- **Carga por viewport / geohash**: los clusters y los contadores del sidebar
  son de toda la ciudad; cargar por recuadro visible los volvería mentira, a
  cambio de bastante complejidad.
- **Mover `monitoreos` a subcolección**: adelgaza los bytes, pero Firestore
  cobra por documento: seguirían siendo 4.785 lecturas por visita.
- **Subir el límite de caché y nada más**: no arregla la primera visita de cada
  persona, que es justo la que importa en un mapa público.
