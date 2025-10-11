import { db } from "../firebase/firebase-config";
import { checkIsSuperAdmin } from "./checkAuthorization";

/**
 * Carga los proyectos de un usuario específico
 * Si el usuario es superadmin, carga TODOS los proyectos
 * @param {string} userEmail - Email del usuario autorizado
 * @returns {Promise<Array>} - Array de proyectos del usuario (o todos si es superadmin)
 */
export const loadProyectos = async (userEmail) => {
  try {
    if (!userEmail) {
      console.error("No se proporcionó email de usuario");
      return [];
    }

    // Verificar si es superadmin
    const isSuperAdmin = await checkIsSuperAdmin(userEmail);

    let proyectosSnapshot;

    if (isSuperAdmin) {
      // Superadmin: cargar TODOS los proyectos
      proyectosSnapshot = await db
        .collection("proyectos")
        .orderBy("createdAt", "desc")
        .get();
    } else {
      // Usuario normal: solo sus proyectos
      proyectosSnapshot = await db
        .collection("proyectos")
        .where("usuarioAutorizado", "==", userEmail)
        .orderBy("createdAt", "desc")
        .get();
    }

    const proyectos = [];
    proyectosSnapshot.forEach((doc) => {
      proyectos.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return proyectos;
  } catch (error) {
    console.error("Error al cargar proyectos:", error);
    return [];
  }
};

/**
 * Carga un proyecto específico y valida que pertenezca al usuario
 * Si el usuario es superadmin, puede ver cualquier proyecto
 * @param {string} proyectoId - ID del proyecto
 * @param {string} userEmail - Email del usuario para validar ownership
 * @returns {Promise<Object|null>} - Proyecto si pertenece al usuario, null si no
 */
export const loadProyectoById = async (proyectoId, userEmail) => {
  try {
    if (!proyectoId || !userEmail) {
      console.error("Faltan parámetros para cargar proyecto");
      return null;
    }

    const docRef = db.collection("proyectos").doc(proyectoId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.error("Proyecto no encontrado");
      return null;
    }

    const proyecto = { id: doc.id, ...doc.data() };

    // Verificar si es superadmin
    const isSuperAdmin = await checkIsSuperAdmin(userEmail);

    // Validar ownership (superadmin puede ver todos)
    if (!isSuperAdmin && proyecto.usuarioAutorizado !== userEmail) {
      console.error("Usuario no autorizado para este proyecto");
      return null;
    }

    return proyecto;
  } catch (error) {
    console.error("Error al cargar proyecto:", error);
    return null;
  }
};

/**
 * Carga los árboles filtrados para un proyecto específico
 * @param {Object} proyecto - Objeto del proyecto con idMapeadores, fechaInicio, fechaFin
 * @returns {Promise<Array>} - Array de árboles que cumplen los filtros del proyecto
 */
export const loadArbolesProyecto = async (proyecto) => {
  try {
    if (!proyecto || !proyecto.idMapeadores || proyecto.idMapeadores.length === 0) {
      return [];
    }

    // Cargar todos los árboles mapeados
    const arbolesSnapshot = await db.collection("arbolesMapeados").get();
    const arbolesMapeados = [];

    arbolesSnapshot.forEach((doc) => {
      arbolesMapeados.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Convertir timestamp de Firebase a Date
    const convertTimestamp = (timestamp) => {
      if (!timestamp) return null;
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000);
      }
      return new Date(timestamp);
    };

    // Obtener timestamp del primer monitoreo
    const getArbolTimestamp = (arbol) => {
      if (!arbol.monitoreos || typeof arbol.monitoreos !== 'object') return null;
      const monitoreoKeys = Object.keys(arbol.monitoreos);
      if (monitoreoKeys.length === 0) return null;
      return arbol.monitoreos[monitoreoKeys[0]].timestamp;
    };

    // Filtrar árboles por mapeadores y fechas del proyecto
    const fechaInicio = convertTimestamp(proyecto.fechaInicio);
    const fechaFin = convertTimestamp(proyecto.fechaFin);

    const arbolesFiltrados = arbolesMapeados.filter((arbol) => {
      // Filtrar por mapeador
      if (!proyecto.idMapeadores.includes(arbol.mapeadoPor)) {
        return false;
      }

      // Filtrar por fecha si está disponible
      const timestamp = getArbolTimestamp(arbol);
      const fechaArbol = convertTimestamp(timestamp);

      if (fechaArbol) {
        if (fechaInicio && fechaArbol < fechaInicio) return false;
        if (fechaFin && fechaArbol > fechaFin) return false;
      }

      return true;
    });

    return arbolesFiltrados;
  } catch (error) {
    console.error("Error al cargar árboles del proyecto:", error);
    return [];
  }
};

/**
 * Carga información de mapeadores desde inscripcionesMapeo
 * @param {Array<string>} mapeadorIds - Array de IDs de mapeadores (Firestore document IDs)
 * @returns {Promise<Array>} - Array con información de mapeadores
 */
export const loadMapeadoresInfo = async (mapeadorIds) => {
  try {
    if (!mapeadorIds || mapeadorIds.length === 0) {
      return [];
    }

    const mapeadores = [];

    // Cargar todos los mapeadores de inscripcionesMapeo
    const inscripcionesSnapshot = await db.collection("inscripcionesMapeo").get();

    inscripcionesSnapshot.forEach((doc) => {
      // Solo incluir mapeadores que estén en la lista de IDs
      if (mapeadorIds.includes(doc.id)) {
        mapeadores.push({
          id: doc.id,
          ...doc.data(),
        });
      }
    });

    return mapeadores;
  } catch (error) {
    console.error("Error al cargar información de mapeadores:", error);
    return [];
  }
};
