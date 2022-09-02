import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCfhkBXyP1Nzh_wcOpY6UCIaE60Nx4wVZ4",
  authDomain: "arbu-c574d.firebaseapp.com",
  databaseURL: "https://arbu-c574d-default-rtdb.firebaseio.com",
  projectId: "arbu-c574d",
  storageBucket: "arbu-c574d.appspot.com",
  messagingSenderId: "657912194867",
  appId: "1:657912194867:web:3d10586dabdcff61998046",
  measurementId: "G-Z58NKJZP1B",
};

// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const analytics = getAnalytics(app);

export {
  db
}
