// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
console.log(import.meta.env.VITE_FIREBASE_API_KEY);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-project-87308.firebaseapp.com",
  projectId: "mern-project-87308",
  storageBucket: "mern-project-87308.firebasestorage.app",
  messagingSenderId: "396306472564",
  appId: "1:396306472564:web:4e1b4f24534527b0047b21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

