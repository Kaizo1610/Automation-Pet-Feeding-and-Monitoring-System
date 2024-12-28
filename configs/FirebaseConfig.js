import { initializeApp, getApps, getApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence, sendEmailVerification } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const firebaseConfig = {
  apiKey: "AIzaSyCHJO1IEzlXd7hV_EXz8NCG0Hb7k8y_DFQ",
  authDomain: "pawtectorproject-6de91.firebaseapp.com",
  projectId: "pawtectorproject-6de91",
  storageBucket: "pawtectorproject-6de91.appspot.com",
  messagingSenderId: "294364458702",
  appId: "1:294364458702:web:9dd0d3862c66ad7367aa9f",
  measurementId: "G-X69EMNEE9V",
  databaseURL: "https://pawtectorproject-6de91-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}
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
      const storageRef = ref(storage, `users/${userId}/pets/${pet.name}/petProfile.jpg`);
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

export const requestNotificationPermission = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.error('Notification permission not granted');
      return null;
    }

    const projectId = Constants.manifest?.extra?.eas?.projectId;
    if (!projectId) {
      throw new Error('Project ID is not set in app configuration');
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: projectId, // Ensure projectId is correctly set
    })).data;
    console.log('Expo Push Token:', token);

    // Log the FCM token to Firestore
    const userId = getCurrentUserId();
    if (userId) {
      await setDoc(doc(firestore, 'users', userId), { fcmToken: token }, { merge: true });
      console.log('FCM Token logged to Firestore');
    }

    return token;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
};

export const saveNotificationPreferences = async (userId, preferences) => {
  try {
    await setDoc(doc(firestore, 'users', userId), { notificationPreferences: preferences }, { merge: true });
  } catch (error) {
    console.error("Error saving notification preferences: ", error);
    throw error;
  }
};

export const getNotificationPreferences = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().notificationPreferences || {};
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error getting notification preferences: ", error);
    throw error;
  }
};

export const sendNotification = async (title, body) => {
  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    const message = {
      to: token,
      sound: 'default',
      title: title,
      body: body,
      data: { someData: 'goes here' },
    };

    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${YOUR_SERVER_KEY}`, // Replace with your FCM server key
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const getWeeklyWaterDispenses = async () => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const querySnapshot = await getDocs(collection(firestore, `users/${userId}/waterDispenses`));
  const dispenses = querySnapshot.docs
    .map(doc => doc.data())
    .filter(dispense => dispense.dispenseTime >= weekAgo);

  const dailyCounts = Array(7).fill(0);
  dispenses.forEach(dispense => {
    const dayIndex = Math.floor((Date.now() - dispense.dispenseTime) / (24 * 60 * 60 * 1000));
    dailyCounts[6 - dayIndex] += 1;
  });

  return dailyCounts;
};

export const getWeeklyFoodDispenses = async () => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const querySnapshot = await getDocs(collection(firestore, `users/${userId}/foodDispenses`));
  const dispenses = querySnapshot.docs
    .map(doc => doc.data())
    .filter(dispense => dispense.dispenseTime >= weekAgo);

  const dailyCounts = Array(7).fill(0);
  dispenses.forEach(dispense => {
    const dayIndex = Math.floor((Date.now() - dispense.dispenseTime) / (24 * 60 * 60 * 1000));
    dailyCounts[6 - dayIndex] += 1;
  });

  return dailyCounts;
};

// Register background task
TaskManager.defineTask('BACKGROUND_FETCH_TASK', async () => {
  try {
    const schedules = await getSchedules(); // Fetch schedules from Firestore
    const currentTime = new Date();
    const currentHours = String(currentTime.getHours()).padStart(2, '0');
    const currentMinutes = String(currentTime.getMinutes()).padStart(2, '0');
    const formattedCurrentTime = `${currentHours}:${currentMinutes}`;

    schedules.forEach((schedule) => {
      if (schedule.time === formattedCurrentTime && schedule.enabled) {
        const portions = parseInt(schedule.portions, 10);
        const title = 'Dispense Notification';
        const body = `${portions} portions of ${schedule.type} have been dispensed at ${formattedCurrentTime}.`;
        sendNotification(title, body);
      }
    });

    return BackgroundFetch.Result.NewData;
  } catch (error) {
    console.error('Error in background fetch task:', error);
    return BackgroundFetch.Result.Failed;
  }
});

export const registerBackgroundFetch = async () => {
  try {
    await BackgroundFetch.registerTaskAsync('BACKGROUND_FETCH_TASK', {
      minimumInterval: 60, // Check every minute
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (error) {
    console.error('Error registering background fetch task:', error);
  }
};

Notifications.addNotificationReceivedListener(notification => {
  console.log('Notification received: ', notification);
});