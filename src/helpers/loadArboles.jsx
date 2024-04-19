import { arboles } from "../components/mapa/arbolesPlantados"
import { db } from "../firebase/firebase-config";

export const loadArboles = async () => {
  // const arbolesSnapshot = await db.collection("arbolesPlantados").get();
  // let arbolesArray = [];
  // await arbolesSnapshot.forEach((element)=>{
  //   arbolesArray.push(element.data());
  // });
  return arboles;
}