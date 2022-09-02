import { scoresMes } from "../components/ranking/scoresMes"
import { db } from "./../firebase/firebase-config";
let Arbol = require('./Arbol.js');
export const traerScoresMes = async() => {
  const scoresSnapshot = await db.collection("9_2022").get();
  let arrayCompetidores = [];
  let arbol = new Arbol();
  await scoresSnapshot.forEach((element)=>{
    arrayCompetidores.push(element.data());
    arbol.insert(element.data());
  });
  const listaOrdenada = await calcularTop(arbol);
  console.log(arrayCompetidores);
  console.log(listaOrdenada);
  

  return listaOrdenada;
}
const calcularTop = async(arbolConNodos) =>{
  let listTop = await arbolConNodos.inorder(arbolConNodos.getRootNode());
  listTop.reverse();
 return listTop;
}
