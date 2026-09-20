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
  importarAportes.js  plantilla, lectura de planilla y escritura por lotes
  listadoAportes.js   árboles → filas (árbol, monitoreo)
  bitacora.js         quién cambió qué y qué decía antes

src/components/aportes/
  Aportes.jsx  ListaAportes.jsx  FormularioAporte.jsx
  SelectorUbicacion.jsx  SubidorFotos.jsx  ImportarAportes.jsx
```

## Lo que hay que saber antes de tocarlo

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

Se comprime en el cliente antes de subir: WebP, lado máximo 1600 px, calidad
0.82. Una foto de teléfono de 4 MB queda en ~300 KB. Si la compresión falla, se
sube el original: mejor 4 MB que perder la foto.

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
