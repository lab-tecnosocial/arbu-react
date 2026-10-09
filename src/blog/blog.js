/**
 * Lee las entradas del blog desde la carpeta `entradas/`.
 *
 * No hace falta tocar este archivo para publicar: basta con crear una carpeta
 * nueva dentro de `entradas/` (ver README.md). Vite encuentra todas las
 * carpetas al compilar, así que no hay ninguna lista que mantener a mano.
 */
import { marked } from "marked";

// Texto de cada `entrada.md`, indexado por su ruta ("./entradas/<carpeta>/entrada.md").
const archivos = import.meta.glob("./entradas/*/entrada.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

// URL final de cada imagen que haya junto a las entradas.
const imagenes = import.meta.glob("./entradas/*/*.{png,jpg,jpeg,webp,gif,svg,avif}", {
  query: "?url",
  import: "default",
  eager: true,
});

/**
 * Separa los datos de arriba (entre las dos líneas `---`) del texto.
 * Formato admitido: una línea por dato, `clave: valor`.
 */
const separarDatos = (texto) => {
  const coincidencia = texto.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!coincidencia) return { datos: {}, cuerpo: texto };

  const datos = {};
  for (const linea of coincidencia[1].split("\n")) {
    const posicion = linea.indexOf(":");
    if (posicion === -1 || linea.trim().startsWith("#")) continue;
    const clave = linea.slice(0, posicion).trim();
    const valor = linea
      .slice(posicion + 1)
      .trim()
      .replace(/^["'](.*)["']$/, "$1");
    if (clave) datos[clave] = valor;
  }
  return { datos, cuerpo: coincidencia[2] };
};

/** "2026-09-28" → Date a medianoche local (sin el desfase de UTC). */
const leerFecha = (texto) => {
  const [anio, mes, dia] = String(texto || "").split("-").map(Number);
  return anio && mes && dia ? new Date(anio, mes - 1, dia) : null;
};

/** Convierte "portada.jpg" en la URL real si la imagen está en la carpeta de la entrada. */
const resolverImagen = (carpeta, ruta) => {
  if (!ruta) return null;
  if (/^(https?:)?\/\//.test(ruta) || ruta.startsWith("/")) return ruta;
  const limpia = ruta.replace(/^\.\//, "");
  return imagenes[`./entradas/${carpeta}/${limpia}`] ?? null;
};

const aHtml = (carpeta, cuerpo) => {
  const renderer = new marked.Renderer();
  const imagenOriginal = renderer.image.bind(renderer);
  // Las imágenes del texto también se escriben con el nombre del archivo.
  renderer.image = (token) =>
    imagenOriginal({ ...token, href: resolverImagen(carpeta, token.href) ?? token.href });
  // Los enlaces externos se abren en otra pestaña.
  const enlaceOriginal = renderer.link.bind(renderer);
  renderer.link = (token) => {
    const html = enlaceOriginal(token);
    return /^https?:\/\//.test(token.href)
      ? html.replace("<a ", '<a target="_blank" rel="noopener noreferrer" ')
      : html;
  };
  return marked.parse(cuerpo, { renderer });
};

const cargarEntradas = () =>
  Object.entries(archivos)
    .map(([ruta, texto]) => {
      const carpeta = ruta.split("/")[2];
      const { datos, cuerpo } = separarDatos(texto);
      return {
        // La dirección de la entrada es el nombre de la carpeta sin la fecha:
        // "2026-09-28-jacarandas" → /blog/jacarandas
        slug: carpeta.replace(/^\d{4}-\d{2}-\d{2}-/, ""),
        carpeta,
        titulo: datos.titulo || carpeta,
        fecha: leerFecha(datos.fecha),
        autor: datos.autor || "",
        descripcion: datos.descripcion || "",
        imagen: resolverImagen(carpeta, datos.imagen),
        borrador: datos.borrador === "si" || datos.borrador === "true",
        html: aHtml(carpeta, cuerpo),
      };
    })
    // Los borradores solo se ven con `pnpm start`, nunca en el sitio publicado.
    .filter((entrada) => import.meta.env.DEV || !entrada.borrador)
    .sort((a, b) => (b.fecha?.getTime() ?? 0) - (a.fecha?.getTime() ?? 0));

export const entradas = cargarEntradas();

export const buscarEntrada = (slug) => entradas.find((e) => e.slug === slug) ?? null;

export const formatearFecha = (fecha) =>
  fecha
    ? fecha.toLocaleDateString("es-BO", { day: "numeric", month: "long", year: "numeric" })
    : "";
