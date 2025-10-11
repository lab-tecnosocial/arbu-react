import { db } from "../firebase/firebase-config";

/**
 * Verifica si un usuario está autorizado para acceder a las tablas
 * @param {string} userEmail - Email del usuario a verificar
 * @returns {Promise<boolean>} - true si está autorizado, false si no
 */
export const checkUserAuthorization = async (userEmail) => {
    try {
        const docRef = db.collection("usuariosAutorizados").doc("accesoTablas");
        const doc = await docRef.get();

        if (!doc.exists) {
            return false;
        }

        const data = doc.data();
        const correosAutorizados = data?.correos || [];

        return correosAutorizados.includes(userEmail);
    } catch (error) {
        console.error("Error al verificar autorización:", error);
        return false;
    }
};

/**
 * Verifica si un usuario es superadministrador
 * @param {string} userEmail - Email del usuario a verificar
 * @returns {Promise<boolean>} - true si es superadmin, false si no
 */
export const checkIsSuperAdmin = async (userEmail) => {
    try {
        const docRef = db.collection("usuariosAutorizados").doc("accesoTablas");
        const doc = await docRef.get();

        if (!doc.exists) {
            return false;
        }

        const data = doc.data();
        const roles = data?.roles || {};

        return roles[userEmail] === 'superadmin';
    } catch (error) {
        console.error("Error al verificar si es superadmin:", error);
        return false;
    }
};

/**
 * Obtiene el rol de un usuario
 * @param {string} userEmail - Email del usuario
 * @returns {Promise<string|null>} - Rol del usuario o null
 */
export const getUserRole = async (userEmail) => {
    try {
        const docRef = db.collection("usuariosAutorizados").doc("accesoTablas");
        const doc = await docRef.get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data();
        const roles = data?.roles || {};

        return roles[userEmail] || 'admin'; // Por defecto 'admin' si no tiene rol específico
    } catch (error) {
        console.error("Error al obtener rol de usuario:", error);
        return null;
    }
};
