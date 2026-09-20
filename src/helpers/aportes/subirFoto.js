import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase/firebase-config";

/**
 * Subir una foto de árbol desde el navegador.
 *
 * Es lo primero que este repo sube a Storage: hasta ahora la web solo LEÍA las
 * URLs que escriben las apps móviles. De ahí dos decisiones:
 *
 *  - **Prefijo propio `aportesWeb/`.** El prefijo que usan las apps no se
 *    conoce desde este repo, y meterse en él obligaría a tocar reglas que ya
 *    funcionan. Con un prefijo separado, las reglas de Storage pueden abrir
 *    esto sin rozar lo existente.
 *  - **Se comprime antes de subir.** Una foto de teléfono son 3-5 MB y se va a
 *    ver a 400 px en una ficha. Subirla entera castiga al que la sube, al que
 *    la mira con datos móviles y a la factura. A 1600 px en WebP quedan ~300 KB
 *    sin pérdida visible.
 */

const LADO_MAXIMO = 1600;
const CALIDAD = 0.82;
const TAMANIO_MAXIMO_ORIGEN = 25 * 1024 * 1024;

export const RAIZ_APORTES = "aportesWeb";

const leerImagen = (archivo) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    img.src = url;
  });

/**
 * Reduce y convierte a WebP.
 * Si algo falla (un formato que el navegador no decodifica, canvas bloqueado),
 * devuelve el archivo original: es mejor subir 4 MB que perder la foto.
 */
export const comprimirImagen = async (archivo) => {
  try {
    const img = await leerImagen(archivo);
    const escala = Math.min(1, LADO_MAXIMO / Math.max(img.width, img.height));

    // Ya es pequeña y ligera: recomprimir solo añadiría artefactos.
    if (escala === 1 && archivo.size < 600 * 1024) return archivo;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * escala);
    canvas.height = Math.round(img.height * escala);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((res) => canvas.toBlob(res, "image/webp", CALIDAD));
    if (!blob || blob.size >= archivo.size) return archivo;
    return blob;
  } catch (error) {
    console.warn("[aportes] no se pudo comprimir, se sube el original:", error);
    return archivo;
  }
};

const extension = (blob) => (blob.type === "image/webp" ? "webp" : (blob.type.split("/")[1] || "jpg"));

/**
 * Sube una foto y devuelve su URL de descarga.
 *
 * @param {File} archivo
 * @param {{arbolId: string, monitoreoKey: string, clave: string}} destino
 * @param {(porcentaje: number) => void} [onProgreso]
 * @returns {Promise<{success: boolean, url?: string, ruta?: string, error?: string}>}
 */
export const subirFoto = async (archivo, destino, onProgreso) => {
  if (!archivo) return { success: false, error: "No hay archivo" };
  if (!archivo.type?.startsWith("image/")) {
    return { success: false, error: "El archivo no es una imagen" };
  }
  if (archivo.size > TAMANIO_MAXIMO_ORIGEN) {
    return { success: false, error: "La imagen pesa más de 25 MB" };
  }

  const blob = await comprimirImagen(archivo);
  const ruta = `${RAIZ_APORTES}/${destino.arbolId}/${destino.monitoreoKey}/${destino.clave}.${extension(blob)}`;
  const referencia = ref(storage, ruta);

  try {
    const tarea = uploadBytesResumable(referencia, blob, {
      contentType: blob.type || "image/webp",
    });

    await new Promise((resolve, reject) => {
      tarea.on(
        "state_changed",
        (snap) => onProgreso?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        reject,
        resolve
      );
    });

    return { success: true, url: await getDownloadURL(referencia), ruta };
  } catch (error) {
    console.error("[aportes] no se pudo subir la foto:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Borra una foto del almacén.
 * Solo se usa al reemplazar una que subió esta misma pantalla: nunca se toca
 * lo que subieron las apps, que vive en otro prefijo.
 */
export const borrarFoto = async (ruta) => {
  if (!ruta?.startsWith(`${RAIZ_APORTES}/`)) return { success: false, error: "Ruta ajena" };
  try {
    await deleteObject(ref(storage, ruta));
    return { success: true };
  } catch (error) {
    console.warn("[aportes] no se pudo borrar la foto:", error);
    return { success: false, error: error.message };
  }
};
