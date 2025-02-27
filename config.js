import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API,
  authDomain: "carbondex-daf16.firebaseapp.com",
  projectId: "carbondex-daf16",
  storageBucket: "carbondex-daf16.appspot.com",
  messagingSenderId: "358691939888",
  appId: "1:358691939888:web:dfbeb187374e0598da2ff5",
  measurementId: "G-WF2TCQV84Y",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
