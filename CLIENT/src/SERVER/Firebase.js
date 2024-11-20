// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Default export
export default app;
// Named exports
export { auth, db };

