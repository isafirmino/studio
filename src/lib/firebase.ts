import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./firebase-config";


let app: FirebaseApp;

if (!getApps().length) {
  try {
    // This will work if you have Firebase App Hosting configured
    app = initializeApp();
  } catch (e) {
    // Fallback to local config for development or other environments
    app = initializeApp(firebaseConfig);
  }
} else {
  app = getApp();
}


const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
