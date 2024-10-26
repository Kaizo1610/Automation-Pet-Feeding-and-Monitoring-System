import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
import { getFirestore } from "firebase/firestore"; // Import Firestore

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHJO1IEzlXd7hV_EXz8NCG0Hb7k8y_DFQ",
  authDomain: "pawtectorproject-6de91.firebaseapp.com",
  projectId: "pawtectorproject-6de91",
  storageBucket: "pawtectorproject-6de91.appspot.com",
  messagingSenderId: "294364458702",
  appId: "1:294364458702:web:9dd0d3862c66ad7367aa9f",
  measurementId: "G-X69EMNEE9V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // Initialize and export Firebase Storage
export const firestore = getFirestore(app); // Initialize and export Firestore