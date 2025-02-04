import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCWEexkac0LpUQJMtp81SligIIYs7eEzes",
    authDomain: "fitclub-473b9.firebaseapp.com",
    projectId: "fitclub-473b9",
    storageBucket: "fitclub-473b9.firebasestorage.app",
    messagingSenderId: "560036687017",
    appId: "1:560036687017:web:a90bcadd896aaaf9c6cdb8",
    measurementId: "G-3VMGEPMFW0"
  };


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 