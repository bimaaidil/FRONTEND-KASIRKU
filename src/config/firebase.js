// frontend/src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// INI YANG SUDAH ANDA GANTI DENGAN ASLI
const firebaseConfig = {
  apiKey: "AIzaSyAZaPGsiwklLvhUaLzll2EDSzqeg7Ct_nk",
  authDomain: "sistem-point-of-sale.firebaseapp.com",
  projectId: "sistem-point-of-sale",
  storageBucket: "sistem-point-of-sale.firebasestorage.app",
  messagingSenderId: "203839659142",
  appId: "1:203839659142:web:86b3192155363f44fe8507"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);