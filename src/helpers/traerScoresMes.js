import { scoresMes } from "../components/ranking/scoresMes"
import { db } from "./../firebase/firebase-config";
// let Arbol = require('./Arbol.js');
import Arbol from './Arbol';
export const traerScoresMes = async() => {
  const date = new Date();
  // console.log(date.getMonth()+1);
  // console.log(date.getFullYear());
  const scoresSnapshot = await db.collection((date.getMonth()+1)+"_"+date.getFullYear()).get();
  let arrayCompetidores = [];
  let arbol = new Arbol();
  await scoresSnapshot.forEach((element)=>{
    arrayCompetidores.push(element.data());
    arbol.insert(element.data());
  });
  const listaOrdenada = await calcularTop(arbol);
  // console.log(arrayCompetidores);
  // console.log(listaOrdenada);
  

  return listaOrdenada;
  // return scoresMes;
}
const calcularTop = async(arbolConNodos) =>{
  let listTop = await arbolConNodos.inorder(arbolConNodos.getRootNode());
  listTop.reverse();
 return listTop;
}
