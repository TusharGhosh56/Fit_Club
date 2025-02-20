import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc} from 'firebase/firestore';
import { setPersistence, browserLocalPersistence, updateProfile } from 'firebase/auth';
import { uploadToCloudinary } from './cloudinaryService';

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
          id: userDoc.id,
          ...userData,
          photoURL: userData.photoURL || null,
          stats: {
            clientsTrained: userData.stats?.clientsTrained || "0",
            successRate: userData.stats?.successRate || "0%",
            certifications: userData.stats?.certifications || "0"
          }
        }
      };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (userId, updatedData) => {
  try {
    if (!auth.currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    await updateDoc(doc(db, 'users', userId), updatedData);
    return { success: true, data: updatedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const uploadProfilePicture = async (file) => {
  try {
    if (!auth.currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    const uploadResult = await uploadToCloudinary(file);
    if (!uploadResult.success) {
      throw new Error(uploadResult.error);
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);
    await Promise.all([
      updateProfile(auth.currentUser, {
        photoURL: uploadResult.url
      }),
      updateDoc(userRef, {
        photoURL: uploadResult.url,
        photoPublicId: uploadResult.publicId
      })
    ]);

    return {
      success: true,
      photoURL: uploadResult.url
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    };
  }
};

export const getProfilePicture = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (userDoc.exists() && userDoc.data().photoURL) {
      return { success: true, photoURL: userDoc.data().photoURL };
    }

    return { success: false, error: 'No profile picture found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
