import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDYAQuDqrCkXts95znZANUqDD-tL9JTkLI",
  authDomain: "cyberqeln.firebaseapp.com",
  projectId: "cyberqeln",
  storageBucket: "cyberqeln.firebasestorage.app",
  messagingSenderId: "746618535148",
  appId: "1:746618535148:web:804914f5037f478f5f39c9",
  measurementId: "G-D83287MGEZ",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
