# Aportes desde la web

`/admin/aportes`, área de permisos `aportes`. Un administrador puede registrar
árboles que no entraron por la app, corregir los que ya están —incluidas
coordenadas y fotos— e importar planillas.

Existe porque hasta septiembre de 2026 **un árbol solo podía nacer en las apps
móviles**. No había un solo `addDoc` contra `arbolesMapeados` en la web, y lo
único editable eran seis campos desde el panel del concurso, atados a una
campaña. Todo lo que llegaba por otra vía —una jornada anotada en papel, fotos
por WhatsApp, un lote de una institución— no tenía puerta de entrada, y un
registro con la ubicación mal puesta no tenía quien lo arreglara.

## Cómo está armado

El centro es un **esquema declarativo por tipo de aporte**
(`src/helpers/aportes/tiposAporte.js`). De esa única declaración salen el
formulario, el validador y el importador de planillas, que si no habría que
escribir por separado y desincronizar. Hoy hay un tipo, `mapeo`
(`arbolesMapeados`); añadir la adopción (`arbolesPlantados`, autoría en
`plantadoPor`, una sola foto `fotografia`) es otra entrada en `TIPOS_APORTE`.

```
src/helpers/aportes/
  tiposAporte.js      el catálogo de tipos y sus campos
  validarAporte.js    normalización y validación (errores vs advertencias)
  escrituraArbol.js   crear, diff y actualizar; reserva de ids
  subirFoto.js        compresión en cliente + subida a Storage
  metadatosFoto.js    EXIF de la foto (GPS y fecha) y cómo se concilia
  importarAportes.js  plantilla, lectura de planilla y escritura por lotes
  listadoAportes.js   árboles → filas (árbol, monitoreo)
  bitacora.js         quién cambió qué y qué decía antes

src/components/aportes/
  Aportes.jsx  ListaAportes.jsx  FormularioAporte.jsx
  SelectorUbicacion.jsx  SubidorFotos.jsx  ImportarAportes.jsx
```

## Lo que hay que saber antes de tocarlo

- **La foto del árbol completo es obligatoria**, en el formulario y en la
  planilla (`tipo.fotoRequerida` en `tiposAporte.js`, validado en
  `validarAporte`). No es un capricho: es lo que hace verificable un registro
  —en la revisión del concurso, un árbol sin foto no se puede validar ni
  descartar, solo arrastrar— y es la única foto que las apps escriben siempre.
  El 21/09/2026 se colaron cuatro aportes sin foto porque la imagen era un HEIC
  que `subirFoto.js` rechazó y el árbol se guardó igual; hubo que borrarlos a
  mano. Si el formulario acepta guardar algo que la foto no respalda, el dato
  nace sin poder comprobarse.

- **Un documento incompleto tumba la app de Android.** Es el incidente del
  21/09/2026: 121 crashes en 13 personas, un `NullPointerException` en
  `MapaFragment.onEvent`. Las apps móviles **nunca omiten un campo** —cuando
  algo está vacío escriben `""` o `0`, y repiten el id del documento dentro del
  documento (`id`)— y leen con `doc.get("campo").toString()`, que revienta si el
  campo no está. Como el fallo ocurre dentro del listener de la colección, **un
  solo documento malo deja sin mapa a todo el mundo**, no solo a quien abre ese
  árbol. La web hacía justo lo contrario: `documentoNuevo()` saltaba todo valor
  vacío. La regla, para cualquier cosa que esta web escriba en las colecciones
  de las apps: **un documento escrito por la web tiene que ser indistinguible de
  uno escrito por la app**. Los campos de más son inofensivos (la app los
  ignora); los de menos son un crash en producción que no se arregla desde
  aquí. Lo garantiza `completarParaApps()`, y el catálogo de campos con su valor
  neutro está en `src/helpers/aportes/esquemaApp.js`, que es la única fuente:
  lo usan el formulario, el importador y el script de reparación.

  Para auditar lo ya guardado —conviene tras cualquier cambio en la escritura—:

  ```bash
  pnpm esquema:app                 # solo mira, no escribe
  pnpm esquema:app -- --aplicar    # rellena lo que falte
  pnpm esquema:app -- --todos      # audita la colección entera, no solo la web
  ```

  Con las fotos hay un matiz que costó una segunda reparación: `fotoArbolCompleto`
  **sí** se rellena (está en el 100% de los monitoreos que escriben las apps),
  mientras que las otras cinco claves (`fotoCorteza`, `fotoHoja`...) no, porque
  faltan a menudo en los propios documentos de la app y por tanto sabe convivir
  con su ausencia. Meterlas todas en el mismo saco dejó 4 documentos sin reparar
  y la app siguió crasheando. En la web no se nota: la galería descarta las urls
  vacías (`getTreePhotos` filtra por `monitoreo[key]`). El `0` de `altura` y
  `diametroAlturaPecho` no inventa una medida (ningún árbol mide 0, y la web ya
  lo lee con `valor && ...` o `valor || null`): es el precio de que la app no
  distinga "sin medir" de "ausente".

- **`mapeadoPor` no es opcional.** El mapa público decide si un árbol es un
  mapeo o una adopción por la simple presencia de ese campo
  (`CardTree.jsx`: `Object.hasOwn(selectedTree, "mapeadoPor")`). Un documento
  sin él se pinta con la galería equivocada y sin escudo scout.

- **`monitoreos` es un mapa, no una subcolección ni un array.** Su clave es un
  id opaco y el orden de `Object.keys` no significa nada: la fecha sale del
  `timestamp` real de cada monitoreo (`fechaArbol.js`). Al actualizar se usa
  ruta de punto (`monitoreos.{key}.{campo}`); escribir el objeto `monitoreos`
  entero borraría los demás monitoreos del árbol.

- **El formulario solo sabe expresar un DÍA; el monitoreo guarda día y hora.**
  Comparar las fechas por milisegundos daba por cambiada cualquier fecha que se
  abriera: abrir un registro y guardarlo sin tocar nada **le borraba la hora al
  monitoreo**, y esa hora no se recupera. Por eso `sonIguales` compara días
  (`aValorFecha`) y, cuando el día sí cambia, `aValorFirestore` **conserva la
  hora original**. Pasó de verdad el 20/09/2026, durante el desarrollo.

- **"Sin foto" llega como `null` y del documento como campo ausente.**
  Tratarlos como distintos escribía un `null` por cada foto no puesta y llenaba
  la bitácora de cambios que nadie hizo. `sonIguales` los equipara.

- **Se escribe solo lo que cambió.** Un `updateDoc` con todos los campos
  pisaría con `""` lo que otra pantalla acabara de arreglar.

- **Firestore cobra por documento.** Tras guardar se relee **un** documento
  (`leerArbol`), no la colección: recargar los ~3.200 árboles por cada
  corrección costaría 3.200 lecturas facturadas cada vez.

- **Caché del mapa público.** Tras escribir se llama a `invalidarMarca`
  (`leerColeccion.js`): si no, el mapa de ese mismo navegador seguiría sirviendo
  su copia de hasta media hora y el admin no vería su propio aporte.

## Fotos y Storage

La web nunca había subido nada a Storage. Ahora sube a
`aportesWeb/{arbolId}/{monitoreoKey}/{clave}.webp`, un **prefijo propio**,
separado del que usan las apps (que este repo no conoce).

**Solo se admiten JPG, PNG y WebP**, y se comprueba antes de comprimir y de
subir. Es una lista blanca por lo que pasó el 21/09/2026, el primer día de uso
real: se subió un **HEIC** —el formato con el que fotografía el iPhone por
defecto—, `comprimirImagen()` no pudo decodificarlo, el fallback «si falla,
sube el original» lo subió tal cual, y la ficha del árbol quedó con una foto
rota en producción. Chrome y Firefox no muestran HEIC; **Safari sí**, así que
quien lo sube desde un Mac ni siquiera ve el problema. Ahora la casilla lo
rechaza y explica qué hacer («exportala o convertila a JPG»), en la casilla y
en un aviso arriba. Una lista negra habría dejado pasar el siguiente formato
exótico.

Lo admitido se comprime en el cliente antes de subir: WebP, lado máximo 1600
px, calidad 0.82. Una foto de teléfono de 4 MB queda en ~300 KB. Si la
compresión falla, se sube el original —que ya se sabe mostrable, porque pasó la
lista blanca—: mejor 4 MB que perder la foto.

Como las fotos se suben mientras se rellena el formulario, el id del árbol y la
clave del monitoreo **se reservan antes de guardar** (`nuevaIdentidadAporte`);
por eso el alta usa `setDoc` y no `addDoc`. Lo subido y luego cancelado se borra
al cerrar el diálogo.

**`storage.rules` está versionado desde el 20/09/2026**, copiado exactamente de
la consola (donde llevaba sin tocarse desde 2021). Dice `allow read, write: if
request.auth != null` para todas las rutas: cualquier autenticado escribe donde
sea. Es la plantilla por defecto de Firebase. No se endureció porque no se sabe
qué prefijos usan Android e iOS y dejarlas sin subir fotos sería peor; apretarlas
es un trabajo aparte que empieza por inventariar el bucket. Se despliega con
`pnpm deploy:storage`, que **no** va en `pnpm deploy` —y que el 20/09/2026
fallaba con «Your project is being set up»; da igual por ahora, porque el
archivo es idéntico a lo publicado y desplegarlo no cambia nada, pero habrá que
resolverlo antes de tocar esas reglas de verdad—.

Las fotos se ven en el mapa público sin sesión porque las URLs de
`getDownloadURL` llevan un token de descarga y no pasan por esas reglas.

Las casillas aceptan **arrastrar y soltar**. Soltar varias fotos de golpe las
reparte por las casillas libres empezando por la de al lado, así que las seis de
un árbol entran de una vez y en el orden del catálogo. Nunca se pisa una casilla
que ya tiene foto: para reemplazarla hay que soltarla encima.

## Lo que la foto ya sabe: ubicación y fecha

Una foto de teléfono trae en su EXIF la coordenada del GPS y la hora del
disparo. Al elegirla, `metadatosFoto.js` los lee y **rellena los campos que
estén en blanco**: ubicación (que mueve el marcador del mapa) y fecha del
mapeo.

- **Se lee del archivo original, nunca del que se sube.** `comprimirImagen()`
  redibuja la foto en un `<canvas>` y un canvas no conserva EXIF: leerlo después
  de comprimir daría siempre vacío. Por eso la lectura arranca en
  `SubidorFotos` antes de llamar a `subirFoto`, en paralelo con la subida, y se
  avisa aunque la subida falle.
- **La foto rellena huecos, no corrige a la persona.** Si ya hay un punto y la
  foto discrepa en más de 25 m, o si la fecha es otra, no se toca nada: se
  ofrece con un botón «Usar los de la foto». Lo contrario convertiría «subí otra
  foto» en «se me movió el árbol». Por debajo de 25 m es ruido del GPS y no se
  pregunta.
- **Al crear, se guarda la hora real del disparo.** El formulario solo expresa
  días, así que un alta normal nace a medianoche; si la foto dice la hora y el
  día sigue siendo el suyo, se conserva esa hora. Al **corregir** no se toca: la
  hora del monitoreo es la que registró la app.
- **(0, 0) y las fechas anteriores a 1990 se descartan**: son el valor por
  defecto de un GPS que no fijó posición y de una cámara sin reloj en hora, no
  un dato.
- **WhatsApp y las redes borran el EXIF al comprimir.** Es la causa habitual de
  que no se rellene nada, y el aviso de la pantalla lo dice para que nadie
  busque el fallo en el código.

Lo lee `exifr` (variante `lite`: la `mini` no trae GPS ni HEIC —el formato del
iPhone— y la `full` pesa el doble por formatos que aquí nadie usa), con **import
dinámico**: son ~45 KB que solo se descargan al elegir una foto, en su propio
chunk, y no entran en el bundle del mapa público.

## Permisos

El área `aportes` gobierna la pantalla y la bitácora. **Para los árboles es solo
una guardia de cliente**: `firestore.rules` permite `create` y `update` sobre
`arbolesMapeados` a cualquier usuario autenticado, porque así escriben las apps
móviles y endurecerlo las rompería. Está dicho aquí para que nadie crea que el
permiso protege el dato.

Lo que sí exige el permiso es `bitacoraAportes`, y además que `editadoPor` sea
el email de quien escribe. Cuatro casos —con permiso, sin permiso, firmando con
otro email y superadmin sin lista— se probaron contra el compilador oficial de
reglas.

## Bitácora

`bitacoraAportes`, de solo añadir: `{coleccion, arbolId, monitoreoKey, accion
("crear"|"editar"|"importar"), cambios: {campo: {antes, despues}}, editadoPor,
editadoEn}`. Con estos datos se deciden premios: hay que poder responder "¿quién
tocó esto y qué decía antes?".

Si la bitácora falla, el aviso lo dice ("se guardó, pero no se pudo anotar") en
vez de ocultarlo. Casi siempre significa que faltan las reglas por desplegar:
`pnpm deploy:rules`.

La del concurso (`proyectos/{id}/correcciones`) sigue existiendo: allí la
corrección pertenece a una campaña concreta.

## Trazabilidad

Todo lo cargado desde la web lleva `registradoDesde: "web"`,
`registradoVia: "formulario" | "planilla"`, `registradoPor: <email>` y
`registradoEn`. De ahí sale el interruptor "solo los cargados desde la web" de
la tabla. La autoría técnica (`mapeadoPor`) es el uid del administrador que lo
sube: **un aporte cargado a mano no puntúa para el joven que lo hizo**. Si
alguna vez hace falta, ese es el sitio donde añadir la atribución a terceros.

## Importar planillas

La plantilla se genera desde el mismo esquema que valida
(`columnasPlantilla` + `exportarFilasAExcel`), así que no pueden
desincronizarse. Nada se escribe hasta ver la previsualización: las filas con
error se marcan y se quedan fuera, las correctas entran. Se escribe con
`writeBatch` en tandas de 500, el límite de Firestore.

Las fotos no se suben desde la planilla: se acepta la URL de una que ya esté en
Storage y el resto se completa después desde el editor.
