import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export const loginUser = async (email, password) => {
  try {
    // First attempt to authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // After successful authentication, check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      // If user doesn't exist in Firestore, sign them out and return error
      await auth.signOut();
      return {
        success: false,
        error: 'User account not found. Please register first.'
      };
    }

    // User exists in both Auth and Firestore
    return {
      success: true,
      user: {
        ...userCredential.user,
        userData: userDoc.data()
      }
    };
  } catch (error) {
    let errorMessage = 'An error occurred during login.';
    
    // Provide more user-friendly error messages
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email. Please register first.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed login attempts. Please try again later.';
        break;
      default:
        errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};