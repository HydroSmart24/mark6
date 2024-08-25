import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyAc25EW6u5SKvgv7p4PnQG88zNZDG7U9_M",
  authDomain: "rpiwaterconsumption.firebaseapp.com",
  projectId: "rpiwaterconsumption",
  storageBucket: "rpiwaterconsumption.appspot.com",
  messagingSenderId: "234293439316",
  appId: "1:234293439316:web:581e0c59f497ac09f9b6c1",
  measurementId: "G-60YTPQFQTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Intialize Firestore
export const db = getFirestore(app);

// Initialize Auth with AsyncStorage Persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});