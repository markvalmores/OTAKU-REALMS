import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkcNgl0WJk4_-pnCrSDfmDTJ7ymjFZIBA",
  authDomain: "gen-lang-client-0288214511.firebaseapp.com",
  projectId: "gen-lang-client-0288214511",
  storageBucket: "gen-lang-client-0288214511.firebasestorage.app",
  messagingSenderId: "846692410980",
  appId: "1:846692410980:web:09ec50542c4b9b29fae171"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
