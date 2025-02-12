import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';


setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});

export const fetchUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        success: true,
        data: {
          ...userData,
          stats: {
            clientsTrained: userData.stats?.clientsTrained || "0",
            successRate: userData.stats?.successRate || "0%",
            certifications: userData.stats?.certifications || "0"
          }
        }
      };
    } else {
   
      const defaultData = {
        fullName: auth.currentUser?.displayName || 'Name Not Set',
        email: auth.currentUser?.email,
        role: 'Member',
        stats: {
          clientsTrained: "0",
          successRate: "0%",
          certifications: "0"
        },
        bio: '',
        phone: '',
        experience: ''
      };

      await setDoc(doc(db, 'users', userId), defaultData);
      
      return {
        success: true,
        data: defaultData
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
    if (!auth.currentUser) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

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