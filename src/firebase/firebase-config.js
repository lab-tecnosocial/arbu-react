import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase (API modular v9: es la única que usa el proyecto)
export const app = initializeApp(firebaseConfig);

/**
 * Caché persistente en IndexedDB: el mapa público lee ~4.800 documentos por
 * visita y sin esto cada recarga los vuelve a pedir al servidor —y a pagar—.
 * Con la caché, la segunda visita del mismo dispositivo se pinta desde disco
 * (ver `leerColeccionConCache`).
 *
 * `persistentMultipleTabManager` porque es normal tener el mapa abierto en
 * varias pestañas; sin él, la segunda pestaña se queda sin caché.
 *
 * Si IndexedDB no está disponible —Safari en privado, almacenamiento
 * bloqueado, algún WebView— `initializeFirestore` lanza, y entonces se sigue
 * con la instancia normal: sin caché, pero funcionando.
 */
const crearDb = () => {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  } catch (error) {
    console.warn("[firestore] sin caché persistente:", error?.message ?? error);
    return getFirestore(app);
  }
};

export const db = crearDb();
export const storage = getStorage(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
