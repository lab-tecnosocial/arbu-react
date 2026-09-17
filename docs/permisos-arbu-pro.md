# Permisos de Arbu Pro

Quién entra al back-office y a qué. Tres niveles, y nada más:

1. **Estar en la lista** (`correos`) → se entra a `/admin`.
2. **Tener el área** (`permisos`) → se entra a esa sección y se opera en ella.
3. **Ser `superadmin`** (`roles`) → todo lo anterior sin lista, más repartir
   accesos y editar o cerrar campañas ajenas.

Se gestiona desde **`/admin/accesos`**, visible solo para un superadmin. Antes
había que entrar a la consola de Firebase.

## Dónde vive

Un único documento: **`usuariosAutorizados/accesoTablas`**.

```jsonc
{
  "correos":  ["alguien@labtecnosocial.org", "..."],           // quién entra
  "roles":    { "alguien@labtecnosocial.org": "superadmin" },  // o "admin"
  "permisos": { "alguien@labtecnosocial.org": ["campanas"] }   // qué áreas
}
```

`"admin"` **no da permisos por sí solo**: es una etiqueta, ninguna regla la
mira. Quien tiene `admin` sin áreas entra a `/admin` y ve un aviso de que aún no
le han asignado ninguna sección.

## Las áreas

El catálogo vive en `src/helpers/permisos.js` y es la fuente única: de ahí salen
las casillas de `/admin/accesos`, las tarjetas de `/admin` y los `permiso=` de
las rutas en `App.jsx`. Los ids viajan a Firestore y los leen las reglas, así
que **no se renombran a la ligera**.

| id | Área | Ruta |
| --- | --- | --- |
| `campanas` | Campañas y concursos | `/campanas` |
| `proyectos` | Proyectos | `/proyectos` |
| `tabla` | Tabla de árboles | `/tabla` |
| `mapeoScout` | Mapeo scout | `/mapeo-scout` |
| `dashboard` | Dashboard | `/dashboard` |

Para añadir un área: una entrada en `PERMISOS`, el `permiso=` en su ruta, y —si
la sección lee colecciones propias— la condición en `firestore.rules`. La UI de
accesos no hay que tocarla: se pinta desde el catálogo.

## Qué puede cada quien

| | En `correos`, sin áreas | Con el área `campanas` | `superadmin` |
| --- | --- | --- | --- |
| Entrar a `/admin` | sí | sí | sí |
| Ver el listado de campañas | no | sí | sí |
| Revisar registros, marcar participantes | no | sí | sí |
| Editar, cerrar o borrar una campaña **ajena** | no | no | sí |
| Editar una campaña **propia** (la creó) | sí | sí | sí |
| Escribir `resultados` del concurso | no | no | sí |
| Repartir accesos (`/admin/accesos`) | no | no | sí |

Un superadmin **no puede quitarse a sí mismo**: ni el formulario lo permite ni
las reglas aceptan una escritura que lo deje fuera de `correos` o sin su rol.
Sin esa cláusula, un despiste dejaría el sistema sin nadie capaz de repartir
accesos.

## La trampa que dio origen a todo esto

`allow read` puede depender del documento (`resource.data.usuarioAutorizado ==
...`). En una **consulta de listado**, Firestore no filtra lo permitido:
**rechaza la consulta entera** si no puede garantizar de antemano que todos los
resultados serían legibles.

Por eso `ListaCampanas` —que hace `getDocs(collection(db, "proyectos"))` sin
filtro— solo funcionaba para un superadmin, y a cualquier otra persona
autorizada le devolvía *Missing or insufficient permissions*. Le pasó a una
compañera el 17/09/2026.

La condición de permiso está escrita justo para evitarlo:

```
function tienePermiso(area) {
  return isSuperAdmin() || (
    isAuthorized() &&
    area in get(/…/usuariosAutorizados/accesoTablas)
              .data.get('permisos', {}).get(request.auth.token.email, [])
  );
}
```

**No mira `resource`**, así que Firestore puede resolver con ella una consulta
entera. Las condiciones que sí miran el documento (ser su dueño) siguen ahí,
pero solo sirven para leerlo de a uno.

## Probar un permiso sin iniciar sesión como nadie

El simulador oficial evalúa las reglas de verdad contra una petición inventada.
Es la forma de tocar `firestore.rules` sin descubrir el fallo en producción:

```bash
TOKEN=$(gcloud auth print-access-token)
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -H "x-goog-user-project: arbu-c574d" \
  "https://firebaserules.googleapis.com/v1/projects/arbu-c574d:test" -d @test.json
```

`test.json` lleva el contenido de `firestore.rules` en `source` y un
`testSuite.testCases` con: la petición (`auth.token.email`, `path`, `method`:
`get` / `list` / `update`), el `resource.data` del documento, el
`request.resource.data` si es escritura, y `functionMocks` para lo que la regla
consulte con `get()` y `exists()` —aquí, `usuariosAutorizados/accesoTablas`—.

`state: SUCCESS` significa **"coincidió con `expectation`"**, no "permitido":
un caso con `expectation: DENY` que sale `SUCCESS` es un acceso correctamente
denegado.

Los casos que conviene mantener verdes al tocar estas reglas:

- quien tiene `campanas` lista campañas; quien no, no;
- quien tiene `campanas` lee y escribe `revisiones`; quien no, no;
- quien no es superadmin no edita una campaña ajena ni escribe accesos;
- un superadmin no puede guardar accesos dejándose fuera;
- **sin sesión** se listan las campañas públicas y los árboles del mapa.

## Migración (17/09/2026)

`scripts/migrar-permisos.sh` dio a las personas que ya tenían acceso las cinco
áreas, para que el cambio no le quitara a nadie lo que ya usaba. A partir de
ahí, todo se recorta o amplía desde `/admin/accesos`.

## Recordatorios

- **`firestore.rules` no se despliega con `pnpm deploy`** (que es
  `--only hosting`): es `pnpm deploy:rules`.
- Cambiar `correos`, `roles` o `permisos` es un dato: surte efecto al instante,
  sin desplegar y sin que nadie cierre sesión. Basta con recargar.
- Ver quién tiene qué, ahora mismo:

  ```bash
  TOKEN=$(gcloud auth print-access-token)
  curl -s -H "Authorization: Bearer $TOKEN" \
    "https://firestore.googleapis.com/v1/projects/arbu-c574d/databases/(default)/documents/usuariosAutorizados/accesoTablas"
  ```
