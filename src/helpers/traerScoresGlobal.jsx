import { db } from "../firebase/firebase-config";
export const traerScoresGlobal = async() => {
    const rankingGlobalDoc = await db.collection("ranking").doc("top100").get();
    const arrayTop100 = rankingGlobalDoc.data()?.top100 ?? [];
   
  return [...arrayTop100].reverse().slice(0, 100);
  // return scoresGlobal;
}