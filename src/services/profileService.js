import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const fetchUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      return {
        success: true,
        data: {
          ...userDoc.data(),
          stats: {
            clientsTrained: userDoc.data().stats.clientsTrained || "0",
            successRate: userDoc.data().stats.successRate || "0%",
            certifications: userDoc.data().stats.certifications || "0"
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

export const updateUserProfile = async (userId, updatedData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updatedData);
    
    return {
      success: true,
      data: updatedData
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}; 