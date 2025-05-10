import { arboles } from "../components/mapa/arbolesPlantados";
import { arbolesMapeados } from "../components/mapa/arbolesMapeados";
import { db } from "../firebase/firebase-config";

export const loadArboles = async () => {
  const arbolesSnapshot = await db.collection("arbolesPlantados").get();
  let arbolesArray = [];
  await arbolesSnapshot.forEach((element)=>{
    arbolesArray.push(element.data());
  });
  return arbolesArray;
}

export const loadArbolesMapeados = async () => {
  const arbolesMapeadosSnapshot = await db.collection("arbolesMapeados").get();
  let arbolesArray = [];
  await arbolesMapeadosSnapshot.forEach((element)=>{
    arbolesArray.push(element.data());
  });
  return arbolesArray;
}