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
