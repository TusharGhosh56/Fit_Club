import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export const fetchUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      return {
        success: true,
        data: {
          ...userDoc.data(),
          stats: {
            clientsTrained: userDoc.data().clientsTrained || "0",
            successRate: userDoc.data().successRate || "0%",
            certifications: userDoc.data().certifications || "0"
          }
        }
      };
    } else {
      return {
        success: false,
        error: 'User profile not found'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}; 