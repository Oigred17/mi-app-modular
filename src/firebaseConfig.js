// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvcKw350wTRJ7EEJFKEI0EGBhenLDrwRc",
  authDomain: "mi-app-modular-12d6f.firebaseapp.com",
  projectId: "mi-app-modular-12d6f",
  storageBucket: "mi-app-modular-12d6f.firebasestorage.app",
  messagingSenderId: "334465033930",
  appId: "1:334465033930:web:f5952f993b87886adcf633",
  measurementId: "G-64Y9X6PH8G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);