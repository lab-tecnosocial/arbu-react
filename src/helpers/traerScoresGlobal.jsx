import { scoresGlobal } from "../components/ranking/scoresGlobal"
import { db } from "../firebase/firebase-config";
export const traerScoresGlobal = async() => {
  //   const rankingGlobalDoc = await db.collection("ranking").doc("top100").get();
  //   const arrayTop100 =  await rankingGlobalDoc.data().top100;
   
  // return arrayTop100.reverse();
  return scoresGlobal;
}