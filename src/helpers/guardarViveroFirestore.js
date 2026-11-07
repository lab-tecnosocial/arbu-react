import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase/firebase-config";
import { invalidarMarca } from "./leerColeccion";
import { comprimirImagen, motivoDeRechazo } from "./aportes/subirFoto";

export const VIVEROS_COLLECTION = "viveros";

const extension = (blob) =>
  blob.type === "image/webp" ? "webp" : blob.type.split("/")[1] || "jpg";

const subirFotoVivero = async (archivo, viveroId, onProgreso) => {
  const rechazo = motivoDeRechazo(archivo);
  if (rechazo) return { success: false, error: rechazo };

  const blob = await comprimirImagen(archivo);
  const ruta = `${VIVEROS_COLLECTION}/${viveroId}/foto.${extension(blob)}`;
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

    return { success: true, url: await getDownloadURL(referencia) };
  } catch (error) {
    console.error("[viveros] no se pudo subir la foto:", error);
    return { success: false, error: error.message };
  }
};

export const guardarVivero = async (datos, foto, onProgreso) => {
  const viveroId = doc(collection(db, VIVEROS_COLLECTION)).id;

  let fotoUrl = null;
  if (foto) {
    const subida = await subirFotoVivero(foto, viveroId, onProgreso);
    if (!subida.success) {
      return { success: false, error: `No se pudo subir la imagen: ${subida.error}` };
    }
    fotoUrl = subida.url;
  }

  try {
    await setDoc(doc(db, VIVEROS_COLLECTION, viveroId), {
      id: viveroId,
      ...datos,
      foto: fotoUrl,
      creadoEn: serverTimestamp(),
    });
    invalidarMarca(VIVEROS_COLLECTION);
    return { success: true, id: viveroId };
  } catch (error) {
    console.error("[viveros] no se pudo guardar:", error);
    return {
      success: false,
      error: error?.code === "permission-denied"
        ? "Firestore rechazó el guardado: inicia sesión con un usuario autorizado."
        : `No se pudo guardar el vivero: ${error.message}`,
    };
  }
};
