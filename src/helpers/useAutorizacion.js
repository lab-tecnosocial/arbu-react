import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { cargarAcceso } from "./checkAuthorization";
import { ACCESO_VACIO, puede } from "./permisos";

/**
 * El acceso del usuario de la sesión: si entra al back-office, si es
 * superadmin y qué áreas tiene.
 *
 * `puedeVer(permiso)` es la pregunta que hacen las pantallas; la guardia real
 * está en las reglas de Firestore, esto solo evita enseñar puertas cerradas.
 */
export const useAutorizacion = () => {
  const { user, checking } = useSelector((state) => state.auth);
  const [estado, setEstado] = useState({ ...ACCESO_VACIO, comprobando: true });

  useEffect(() => {
    let vigente = true;

    if (checking) {
      setEstado({ ...ACCESO_VACIO, comprobando: true });
      return undefined;
    }

    if (!user?.email) {
      setEstado({ ...ACCESO_VACIO, comprobando: false });
      return undefined;
    }

    cargarAcceso(user.email).then((acceso) => {
      if (vigente) setEstado({ ...acceso, comprobando: false });
    });

    return () => { vigente = false; };
  }, [user?.email, checking]);

  return { ...estado, puedeVer: (permiso) => puede(estado, permiso) };
};
