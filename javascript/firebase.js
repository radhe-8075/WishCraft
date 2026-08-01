import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAYpdZpacxo8QllFKkg9bWB4Ms4vEyf96k",
  authDomain: "wishcraft-b4107.firebaseapp.com",
  projectId: "wishcraft-b4107",
  storageBucket: "wishcraft-b4107.firebasestorage.app",
  messagingSenderId: "511607778799",
  appId: "1:511607778799:web:919541fa84f4fb00e41a1a"
};

// Reuse the app if this module is evaluated more than once during development.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
