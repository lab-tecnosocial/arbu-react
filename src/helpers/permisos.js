/**
 * Permisos de Arbu Pro.
 *
 * Un permiso es un área del back-office. El modelo tiene tres niveles y nada
 * más, para que se pueda razonar de un vistazo:
 *
 * - estar en `usuariosAutorizados/accesoTablas.correos` → se entra a `/admin`;
 * - tener el permiso del área → se entra a esa sección y se opera en ella;
 * - ser `superadmin` → todo lo anterior, sin lista, más gestionar permisos.
 *
 * El id de cada permiso viaja a Firestore (en el mapa `permisos` del documento
 * de autorizados) y lo leen también las reglas: no se renombra a la ligera.
 */
export const PERMISOS = [
  {
    id: "campanas",
    etiqueta: "Campañas y concursos",
    descripcion: "Ver campañas, revisar registros y tabla de posiciones.",
    ruta: "/campanas",
  },
  {
    id: "proyectos",
    etiqueta: "Proyectos",
    descripcion: "Proyectos de plantación, mapeadores y sus árboles.",
    ruta: "/proyectos",
  },
  {
    id: "tabla",
    etiqueta: "Tabla de árboles",
    descripcion: "Edición y validación de los datos de árboles.",
    ruta: "/tabla",
  },
  {
    id: "mapeoScout",
    etiqueta: "Mapeo scout",
    descripcion: "Participantes, grupos, solicitudes y exportación a Excel.",
    ruta: "/mapeo-scout",
  },
  {
    id: "dashboard",
    etiqueta: "Dashboard",
    descripcion: "Panel de indicadores.",
    ruta: "/dashboard",
  },
];

export const IDS_PERMISOS = PERMISOS.map((p) => p.id);

/** Lo que se sabe de alguien sin sesión, o mientras se comprueba. */
export const ACCESO_VACIO = Object.freeze({
  autorizado: false,
  esSuperadmin: false,
  rol: null,
  permisos: [],
});

/**
 * ¿Este acceso alcanza para `permiso`?
 *
 * Sin `permiso`, la pregunta es solo si entra al back-office. Un superadmin
 * pasa siempre: por eso las reglas de Firestore pueden resolver un listado
 * completo para él —su condición no depende de ningún documento—.
 */
export const puede = (acceso, permiso) => {
  if (!acceso?.autorizado) return false;
  if (!permiso) return true;
  return acceso.esSuperadmin || acceso.permisos.includes(permiso);
};

/** Las áreas que esta persona puede abrir, para pintar el menú de `/admin`. */
export const permisosEfectivos = (acceso) =>
  PERMISOS.filter((p) => puede(acceso, p.id));
