// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDI7LDDSOpr_ilwJ2MtWmH5LkWZ1Ea15h4",
  authDomain: "shop-application-bc044.firebaseapp.com",
  projectId: "shop-application-bc044",
  storageBucket: "shop-application-bc044.firebasestorage.app",
  messagingSenderId: "171613174457",
  appId: "1:171613174457:web:e83483375153a77f5f3968",
  measurementId: "G-RGZD3TTL9K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app); 
export const db = getFirestore(app); 

export default app;