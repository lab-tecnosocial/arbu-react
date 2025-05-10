import { usuarios } from "../components/mapa/usuarios";
import { db } from "../firebase/firebase-config";

export const loadUsuarios = async () => {
  const usuariosSnapshot = await db.collection('usuarios_public').get();
  let arrayUsuarios= [];
  await usuariosSnapshot.forEach((element)=>{
    arrayUsuarios.push(element.data());
  });
  return arrayUsuarios;
  // return usuarios;
}