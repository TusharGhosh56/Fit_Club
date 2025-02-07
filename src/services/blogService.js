import { auth, db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';

export const fetchPosts = async () => {
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const fetchedPosts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toLocaleString() || new Date().toLocaleString()
    }));
    
    return {
      success: true,
      data: fetchedPosts
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const createPost = async (text) => {
  try {
    if (!auth.currentUser) {
      return {
        success: false,
        error: 'User must be logged in to post'
      };
    }

    const postData = {
      text,
      createdAt: serverTimestamp(),
      authorId: auth.currentUser.uid,
      authorName: auth.currentUser.displayName || 'Anonymous',
      authorEmail: auth.currentUser.email,
      authorPhoto: auth.currentUser.photoURL || null,
      likes: 0,
      comments: []
    };

    const docRef = await addDoc(collection(db, 'posts'), postData);

    return {
      success: true,
      data: {
        id: docRef.id,
        ...postData,
        createdAt: new Date().toLocaleString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}; 