import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc as docRef,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { checkIsSuperAdmin } from "./checkAuthorization";
import { parseFechaLocal } from "./fechaArbol";

/**
 * Campos del modelo de campaña (v2). Solo se escriben los que vengan
 * definidos: así un formulario antiguo no borra lo que no conoce, y un
 * documento v1 sigue leyéndose con su semántica original.
 */
const camposCampania = (datos) => {
  const campos = {};
  const copiar = (clave) => {
    if (datos[clave] !== undefined) campos[clave] = datos[clave];
  };
  ["schemaVersion", "slug", "tipo", "descripcion", "publica", "destacada",
    "participacion", "reglas", "iconoMarcador"].forEach(copiar);
  return campos;
};

/**
 * Crea un nuevo proyecto
 * @param {Object} proyectoData - Datos del proyecto
 * @param {string} userEmail - Email del usuario que crea el proyecto
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export const crearProyecto = async (proyectoData, userEmail) => {
  try {
    if (!userEmail) {
      return { success: false, error: "Usuario no autenticado" };
    }

    // Validar datos requeridos
    if (!proyectoData.nombreProyecto) {
      return { success: false, error: "El nombre del proyecto es requerido" };
    }

    if (!proyectoData.fechaInicio || !proyectoData.fechaFin) {
      return { success: false, error: "Las fechas de inicio y fin son requeridas" };
    }

    // Fechas en hora LOCAL (UTC-4), no UTC: `new Date("2026-09-30")` es medianoche
    // UTC, o sea el 29 a las 20:00 en Bolivia. El fin de día es inclusivo.
    const inicio = parseFechaLocal(proyectoData.fechaInicio);
    const fin = parseFechaLocal(proyectoData.fechaFin, { finDeDia: true });
    if (fin < inicio) {
      return { success: false, error: "La fecha de fin debe ser posterior a la fecha de inicio" };
    }

    // Preparar documento
    const nuevoProyecto = {
      nombreProyecto: proyectoData.nombreProyecto.trim(),
      fechaInicio: Timestamp.fromDate(inicio),
      fechaFin: Timestamp.fromDate(fin),
      usuarioAutorizado: userEmail, // Auto-asignado, no editable por el usuario
      idMapeadores: proyectoData.idMapeadores || [],
      ...camposCampania(proyectoData),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Crear documento en Firestore
    const nuevoDoc = await addDoc(collection(db, "proyectos"), nuevoProyecto);

    return { success: true, id: nuevoDoc.id };
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualiza un proyecto existente
 * Superadmin puede editar cualquier proyecto
 * @param {string} proyectoId - ID del proyecto a actualizar
 * @param {Object} proyectoData - Nuevos datos del proyecto
 * @param {string} userEmail - Email del usuario para validar ownership
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const actualizarProyecto = async (proyectoId, proyectoData, userEmail) => {
  try {
    if (!proyectoId || !userEmail) {
      return { success: false, error: "Parámetros inválidos" };
    }

    // Obtener proyecto actual para validar ownership
    const proyectoRef = docRef(db, "proyectos", proyectoId);
    const snapshot = await getDoc(proyectoRef);

    if (!snapshot.exists()) {
      return { success: false, error: "Proyecto no encontrado" };
    }

    const proyectoActual = snapshot.data();

    // Verificar si es superadmin
    const isSuperAdmin = await checkIsSuperAdmin(userEmail);

    // Validar ownership (superadmin puede editar cualquier proyecto)
    if (!isSuperAdmin && proyectoActual.usuarioAutorizado !== userEmail) {
      return { success: false, error: "No tienes permiso para editar este proyecto" };
    }

    // Validar datos
    if (proyectoData.fechaInicio && proyectoData.fechaFin) {
      const inicio = parseFechaLocal(proyectoData.fechaInicio);
      const fin = parseFechaLocal(proyectoData.fechaFin, { finDeDia: true });
      if (fin < inicio) {
        return { success: false, error: "La fecha de fin debe ser posterior a la fecha de inicio" };
      }
    }

    // Preparar datos actualizados
    const datosActualizados = {
      updatedAt: serverTimestamp(),
    };

    if (proyectoData.nombreProyecto) {
      datosActualizados.nombreProyecto = proyectoData.nombreProyecto.trim();
    }

    if (proyectoData.fechaInicio) {
      datosActualizados.fechaInicio = Timestamp.fromDate(parseFechaLocal(proyectoData.fechaInicio));
    }

    if (proyectoData.fechaFin) {
      datosActualizados.fechaFin = Timestamp.fromDate(
        parseFechaLocal(proyectoData.fechaFin, { finDeDia: true })
      );
    }

    if (proyectoData.idMapeadores !== undefined) {
      datosActualizados.idMapeadores = proyectoData.idMapeadores;
    }

    Object.assign(datosActualizados, camposCampania(proyectoData));

    // NO permitir cambiar usuarioAutorizado

    // Actualizar documento
    await updateDoc(proyectoRef, datosActualizados);

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar proyecto:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Elimina un proyecto
 * Superadmin puede eliminar cualquier proyecto
 * @param {string} proyectoId - ID del proyecto a eliminar
 * @param {string} userEmail - Email del usuario para validar ownership
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const eliminarProyecto = async (proyectoId, userEmail) => {
  try {
    if (!proyectoId || !userEmail) {
      return { success: false, error: "Parámetros inválidos" };
    }

    // Obtener proyecto para validar ownership
    const proyectoRef = docRef(db, "proyectos", proyectoId);
    const snapshot = await getDoc(proyectoRef);

    if (!snapshot.exists()) {
      return { success: false, error: "Proyecto no encontrado" };
    }

    const proyecto = snapshot.data();

    // Verificar si es superadmin
    const isSuperAdmin = await checkIsSuperAdmin(userEmail);

    // Validar ownership (superadmin puede eliminar cualquier proyecto)
    if (!isSuperAdmin && proyecto.usuarioAutorizado !== userEmail) {
      return { success: false, error: "No tienes permiso para eliminar este proyecto" };
    }

    // Eliminar documento
    await deleteDoc(proyectoRef);

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar proyecto:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Busca mapeadores por email en inscripcionesMapeo
 * @param {string} email - Email a buscar
 * @returns {Promise<Array>} - Array de mapeadores que coinciden
 */
export const buscarMapeadorPorEmail = async (email) => {
  try {
    if (!email || email.trim().length === 0) {
      return [];
    }

    const emailLowerCase = email.toLowerCase().trim();

    // Obtener todos los documentos de inscripcionesMapeo
    const snapshot = await getDocs(collection(db, "inscripcionesMapeo"));
    const mapeadores = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Buscar coincidencias en el email
      if (data.email && data.email.toLowerCase().includes(emailLowerCase)) {
        mapeadores.push({
          id: doc.id,
          ...data,
        });
      }
    });

    return mapeadores;
  } catch (error) {
    console.error("Error al buscar mapeador:", error);
    return [];
  }
};

/**
 * Obtiene información completa de un mapeador por su ID
 * @param {string} mapeadorId - ID del mapeador (document ID en inscripcionesMapeo)
 * @returns {Promise<Object|null>} - Datos del mapeador o null
 */
export const obtenerMapeadorPorId = async (mapeadorId) => {
  try {
    if (!mapeadorId) {
      return null;
    }

    const snapshot = await getDoc(docRef(db, "inscripcionesMapeo", mapeadorId));

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("Error al obtener mapeador:", error);
    return null;
  }
};
