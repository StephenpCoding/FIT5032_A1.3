// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrAw2TFnLimIjYj-8SgKMRYYYscUlyc4I",
  authDomain: "community-sport-health.firebaseapp.com",
  projectId: "community-sport-health",
  storageBucket: "community-sport-health.firebasestorage.app",
  messagingSenderId: "298837077901",
  appId: "1:298837077901:web:d48369915fb9dce1ae97c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);