import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence, sendEmailVerification } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
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

export const getCurrentUserId = () => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

export const getPetByName = async (name) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");

  const querySnapshot = await getDocs(collection(firestore, `users/${userId}/pets`));
  const pet = querySnapshot.docs.find(doc => doc.data().name.toLowerCase() === name.toLowerCase());
  return pet ? pet.data() : null;
};

export const addPet = async (pet) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");

  try {
    let imageUrl = null;
    if (pet.image && pet.image.uri) {
      // Upload image to Firebase Storage
      const response = await fetch(pet.image.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `users/${userId}/pets/${pet.name}`);
      await uploadBytes(storageRef, blob);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Save pet data with image URL to Firestore
    const petData = { ...pet, image: imageUrl };
    const docRef = await addDoc(collection(firestore, `users/${userId}/pets`), petData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding pet: ", error);
    throw error;
  }
};

export const getCurrentUsername = async () => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");

  const userDoc = await getDoc(doc(firestore, 'users', userId));
  return userDoc.exists() ? userDoc.data().username : null;
};

export const saveUsername = async (userId, username) => {
  await setDoc(doc(firestore, 'users', userId), { username });
};

export const uploadProfileImage = async (userId, imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `users/${userId}/profile.jpg`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading profile image: ", error);
    throw error;
  }
};