import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDie7Ua9OhTqWsqdR3fhnmbKSz7k5KrgtQ",
  authDomain: "studio-3302383355-1ea39.firebaseapp.com",
  projectId: "studio-3302383355-1ea39",
  storageBucket: "studio-3302383355-1ea39.firebasestorage.app",
  messagingSenderId: "1096593910879",
  appId: "1:1096593910879:web:3112124e5f2a31ec2affea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
