import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrAw2TFnLimIjYj-8SgKMRYYYscUlyc4I",
  authDomain: "community-sport-health.firebaseapp.com",
  projectId: "community-sport-health",
  storageBucket: "community-sport-health.firebasestorage.app",
  messagingSenderId: "298837077901",
  appId: "1:298837077901:web:d48369915fb9dce1ae97c4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ 新增
