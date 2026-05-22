import { db } from "../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Arbol from "./Arbol";

export const traerScoresMes = async () => {
  try {
    const date = new Date();
    const nombreColeccion = (date.getMonth()+1) + "_" + date.getFullYear();
    //const nombreColeccion = "5_2025";
    const scoresRef = collection(db, nombreColeccion);
    const scoresSnapshot = await getDocs(scoresRef);
    let arrayCompetidores = [];
    let arbol = new Arbol();

    scoresSnapshot.forEach((doc) => {
      const data = doc.data();
      arrayCompetidores.push(data);
      arbol.insert(data);
    });
    const listaOrdenada = await calcularTop(arbol);
    return listaOrdenada.slice(0, 30);

  } catch (error) {
    console.log("Error en traerScoresMes:", error);
    throw error;
  }
};

const calcularTop = async (arbolConNodos) => {
  let listTop = await arbolConNodos.inorder(arbolConNodos.getRootNode());
  listTop.reverse();
  return listTop;
};