// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpY--HmY6zqgRvrtHhUA69L2_n3vHWWDM",
  authDomain: "tims-glam.firebaseapp.com",
  projectId: "tims-glam",
  storageBucket: "tims-glam.firebasestorage.app",
  messagingSenderId: "149365372254",
  appId: "1:149365372254:web:a5628d834492dfafb8cbcf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
