import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./../firebase/firebase-config";
import { ACCESO_VACIO, IDS_PERMISOS } from "./permisos";

const REF = () => doc(db, "usuariosAutorizados", "accesoTablas");

/**
 * Toda la autorización de Arbu Pro sale de un único documento:
 * `usuariosAutorizados/accesoTablas`.
 *
 *   correos:  ["a@x.com", ...]          quién entra al back-office
 *   roles:    { "a@x.com": "superadmin" | "admin" }
 *   permisos: { "a@x.com": ["campanas", "tabla"] }
 *
 * `admin` no da nada por sí solo: es una etiqueta. Lo que abre puertas es el
 * mapa `permisos`, y `superadmin` que se las salta todas.
 */
const leerDocumento = async () => {
  const snapshot = await getDoc(REF());
  return snapshot.exists() ? snapshot.data() : null;
};

// El documento se consultaba en cada montaje de ProtectedRoute y otra vez en
// cada pantalla. Se lee una vez por sesión y se reparte.
let promesaDocumento = null;

const documento = () => {
  if (!promesaDocumento) promesaDocumento = leerDocumento();
  return promesaDocumento;
};

/** Tras guardar permisos hay que olvidar lo leído, o la UI miente. */
export const invalidarAcceso = () => {
  promesaDocumento = null;
};

const perfil = (data, email) => {
  if (!data || !email) return ACCESO_VACIO;

  const autorizado = (data.correos || []).includes(email);
  const rol = data.roles?.[email] ?? null;
  const esSuperadmin = rol === "superadmin";
  const permisos = (data.permisos?.[email] || []).filter((p) => IDS_PERMISOS.includes(p));

  return { autorizado, esSuperadmin, rol, permisos };
};

/** El acceso completo de un email: una sola lectura para todas las preguntas. */
export const cargarAcceso = async (email) => {
  try {
    return perfil(await documento(), email);
  } catch (error) {
    console.error("[autorización] no se pudo leer el documento de accesos:", error);
    return ACCESO_VACIO;
  }
};

/** El documento entero. Solo lo necesita la pantalla que gestiona accesos. */
export const cargarAccesosDeTodos = async () => {
  invalidarAcceso();
  const data = (await documento()) ?? {};
  return {
    correos: data.correos || [],
    roles: data.roles || {},
    permisos: data.permisos || {},
  };
};

/**
 * Guarda la tabla de accesos completa. Las reglas solo dejan escribir aquí a un
 * superadmin; esto es la mitad del cliente, no la defensa.
 */
export const guardarAccesos = async ({ correos, roles, permisos }) => {
  await setDoc(REF(), { correos, roles, permisos }, { merge: true });
  invalidarAcceso();
};

export const checkUserAuthorization = async (userEmail) =>
  (await cargarAcceso(userEmail)).autorizado;

export const checkIsSuperAdmin = async (userEmail) =>
  (await cargarAcceso(userEmail)).esSuperadmin;

export const getUserRole = async (userEmail) => (await cargarAcceso(userEmail)).rol;
