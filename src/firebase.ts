// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8VekpXbmpa8sSXxUS3ccGYBAHiMsrQvE",
  authDomain: "nwitter-reloaded-60648.firebaseapp.com",
  projectId: "nwitter-reloaded-60648",
  storageBucket: "nwitter-reloaded-60648.appspot.com",
  messagingSenderId: "857354872480",
  appId: "1:857354872480:web:9e6e2ee2248605d850cbc5",
  measurementId: "G-Q58LBLW119"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const storage = getStorage(app);
export const db = getFirestore(app);