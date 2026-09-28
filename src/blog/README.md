# Blog de Arbu

Cada entrada del blog es **una carpeta** dentro de `entradas/`. No hace falta
tocar código: el sitio encuentra solo todas las carpetas.

```
src/blog/
├── README.md            ← estas instrucciones
├── plantilla/           ← carpeta modelo, para copiar
│   ├── entrada.md
│   └── portada.png
└── entradas/
    ├── 2026-09-28-bienvenida/
    │   ├── entrada.md   ← el texto de la entrada
    │   └── portada.png  ← la imagen de la tarjeta (y otras fotos)
    └── 2026-10-05-jornada-de-mapeo/
        └── ...
```

## Publicar una entrada nueva

1. **Copia la carpeta `plantilla/`** dentro de `entradas/`.
2. **Cámbiale el nombre** con la fecha y unas pocas palabras, en minúsculas,
   sin tildes ni espacios (usa guiones):
   `2026-10-05-jornada-de-mapeo`.
   La parte después de la fecha es la dirección de la entrada:
   `arbu…/blog/jornada-de-mapeo`. Tiene que ser distinta para cada entrada.
3. **Cambia la foto de portada**: reemplaza `portada.png` por tu imagen
   (puede ser `.jpg`, `.png` o `.webp`). Si le pones otro nombre, escríbelo
   igual en la línea `imagen:`.
4. **Abre `entrada.md`** y rellena los datos de arriba:

   | Dato          | Qué poner                                                  |
   |---------------|------------------------------------------------------------|
   | `titulo`      | El título.                                                 |
   | `fecha`       | La fecha de publicación, en formato `AAAA-MM-DD`.          |
   | `autor`       | Quién la escribe (opcional).                               |
   | `descripcion` | Una o dos frases; es lo que se lee en la tarjeta.          |
   | `imagen`      | El nombre del archivo de la portada.                       |
   | `borrador`    | `si` mientras la escribes; `no` cuando esté lista.         |

5. **Escribe el texto** debajo de la segunda línea `---`. Se usa Markdown; la
   plantilla trae ejemplos de subtítulos, negritas, listas, citas y fotos.
6. **Revísala** con `pnpm start` y entrando a `/blog`. Los borradores se ven
   ahí con una etiqueta "Borrador".
7. **Publícala**: pon `borrador: no`, guarda, haz commit y despliega el sitio
   como siempre.

Las entradas se ordenan solas por fecha, de la más reciente a la más antigua.

## Consejos

- **Fotos livianas**: antes de subirlas, redúcelas a unos 1600 px de ancho.
  Una foto de celular sin reducir hace lenta la página.
- **La portada se recorta** a formato 16:9 en la tarjeta: deja lo importante
  en el centro de la foto.
- **Para quitar una entrada**, borra su carpeta (o vuelve a `borrador: si`).
- Si algo no aparece, revisa que el archivo se llame exactamente `entrada.md`
  y que las líneas `---` de arriba estén completas.
