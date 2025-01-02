import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBQ8TrbU_uUuC-6JdoVPPPuuu8ozIk575w",
  authDomain: "high-five-f3fac.firebaseapp.com",
  databaseURL: "https://high-five-f3fac-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "high-five-f3fac",
  storageBucket: "high-five-f3fac.firebasestorage.app",
  messagingSenderId: "1043407565310",
  appId: "1:1043407565310:web:f602b09f7ae047819690af",
  measurementId: "G-K2XNE09H7B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
