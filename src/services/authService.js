import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';


setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export const signup = async (email, password, fullName) => {
  try {
   
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: fullName
    });


    await setDoc(doc(db, 'users', user.uid), {
      fullName,
      email,
      createdAt: new Date().toISOString(),
      role: 'Member',
      phone: '',
      experience: '',
      bio: '',
      photoURL: '',
      clientsTrained: '0',
      successRate: '0%',
      certifications: '0',
      programs: [],
      workoutHistory: []
    });

    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};


export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};


export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};


export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}; 