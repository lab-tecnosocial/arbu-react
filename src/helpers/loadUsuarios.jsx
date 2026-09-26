import { db } from "../firebase/firebase-config";
import { anotarLecturas } from "./leerColeccion";
import { collection, documentId, getDocs, query, where } from "firebase/firestore"

export const loadUsuarios = async () => {
  const usuariosCol = collection(db, 'usuarios_public');
  const snapshot = await getDocs(usuariosCol);
  // Sin el id del documento, getFullNameUser() de CardTree no encuentra a nadie.
  const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  anotarLecturas("servidor", "usuarios_public (colección entera)", lista.length);
  return lista;
};

/** Firestore admite como mucho 30 valores por cláusula `in`. */
const TAMANO_LOTE = 30;

/**
 * Los usuarios de una lista concreta de ids, no la colección entera.
 *
 * El mapa solo necesita el nombre de quien plantó o monitoreó el árbol que
 * alguien acaba de abrir: pedir los 1.255 usuarios al entrar era el 20% de las
 * lecturas de la página para resolver, casi siempre, uno o dos nombres.
 */
export const loadUsuariosPorIds = async (ids) => {
  const unicos = [...new Set(ids.filter(Boolean))];
  if (unicos.length === 0) return [];

  const lotes = [];
  for (let i = 0; i < unicos.length; i += TAMANO_LOTE) {
    lotes.push(unicos.slice(i, i + TAMANO_LOTE));
  }

  const respuestas = await Promise.all(
    lotes.map((lote) =>
      getDocs(query(collection(db, 'usuarios_public'), where(documentId(), 'in', lote)))
    )
  );

  const usuarios = respuestas.flatMap((snapshot) =>
    snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  );
  anotarLecturas("servidor", "usuarios_public (por id)", usuarios.length);
  return usuarios;
};
