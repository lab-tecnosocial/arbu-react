import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { checkUserAuthorization } from "./checkAuthorization";

/**
 * ¿El usuario actual está en usuariosAutorizados/accesoTablas?
 *
 * Con caché en memoria: ese documento se releía de Firestore en cada montaje de
 * ProtectedRoute y otra vez en cada pantalla que lo consultaba.
 */
const cache = new Map();

const autorizado = (email) => {
  if (!email) return Promise.resolve(false);
  if (!cache.has(email)) cache.set(email, checkUserAuthorization(email));
  return cache.get(email);
};

export const useAutorizacion = () => {
  const { user, checking } = useSelector((state) => state.auth);
  const [estado, setEstado] = useState({ autorizado: false, comprobando: true });

  useEffect(() => {
    let vigente = true;

    if (checking) {
      setEstado({ autorizado: false, comprobando: true });
      return undefined;
    }

    if (!user?.email) {
      setEstado({ autorizado: false, comprobando: false });
      return undefined;
    }

    autorizado(user.email).then((res) => {
      if (vigente) setEstado({ autorizado: res, comprobando: false });
    });

    return () => { vigente = false; };
  }, [user?.email, checking]);

  return estado;
};
