// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi1zrcnk1CBZkywdi2Cng3ZdKJImlgwq4",
  authDomain: "taskminder-94f45.firebaseapp.com",
  projectId: "taskminder-94f45",
  storageBucket: "taskminder-94f45.firebasestorage.app",
  messagingSenderId: "492162730706",
  appId: "1:492162730706:web:68e62ef81fa340eee73b0b",
  measurementId: "G-TZJF1BPK3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs };