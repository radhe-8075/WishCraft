// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAYpdZpacxo8QllFKkg9bWB4Ms4vEyf96k",
  authDomain: "wishcraft-b4107.firebaseapp.com",
  projectId: "wishcraft-b4107",
  storageBucket: "wishcraft-b4107.firebasestorage.app",
  messagingSenderId: "511607778799",
  appId: "1:511607778799:web:919541fa84f4fb00e41a1a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
