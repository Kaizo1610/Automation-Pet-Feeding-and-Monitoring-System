import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence, sendEmailVerification } from "firebase/auth";
import { getStorage } from "firebase/storage"; 
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
//export const analytics = getAnalytics(app);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  if (e.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw e;
  }
}

export { auth };
export const storage = getStorage(app); 
export const firestore = getFirestore(app);
export const database = getDatabase(app);

export const getPetByName = async (name) => {
  const querySnapshot = await getDocs(collection(firestore, "pets"));
  const pet = querySnapshot.docs.find(doc => doc.data().name.toLowerCase() === name.toLowerCase());
  return pet ? pet.data() : null;
};

export const addPet = async (pet) => {
  try {
    const docRef = await firestore.collection("pets").add(pet);
    return docRef.id;
  } catch (error) {
    console.error("Error adding pet: ", error);
    throw error;
  }
};