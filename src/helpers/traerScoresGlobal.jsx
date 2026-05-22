import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export const traerScoresGlobal = async () => {
  const rankingGlobalDoc = await getDoc(doc(db, "ranking", "top100"));

  if (!rankingGlobalDoc.exists()) {
    console.log("El documento no existe");
    return [];
  }

  const data = rankingGlobalDoc.data();
  const arrayTop100 = data?.top100 ?? [];
  return [...arrayTop100].reverse().slice(0, 100);
};