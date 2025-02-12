import { auth, db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  getDocs, 
  serverTimestamp, 
  doc,
  getDoc,
  deleteDoc, 
  updateDoc
} from 'firebase/firestore';
import { uploadToCloudinary } from './cloudinaryService'; 

export const fetchPosts = async () => {
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const fetchedPosts = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
      const postData = docSnapshot.data();
      
      const authorRef = doc(db, 'users', postData.authorId);
      const authorSnap = await getDoc(authorRef);
      const authorData = authorSnap.exists() ? authorSnap.data() : {};
      
      return {
        id: docSnapshot.id,
        ...postData,
        authorPhoto: authorData.photoURL || null,
        createdAt: postData.createdAt?.toDate().toLocaleString() || new Date().toLocaleString()
      };
    }));
    
    return {
      success: true,
      data: fetchedPosts
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const createPost = async (text, image) => { 
  try {
    if (!auth.currentUser) {
      return {
        success: false,
        error: 'User must be logged in to post'
      };
    }

   
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : {};

    let imageUrl = null;
    if (image) {
      const uploadResult = await uploadToCloudinary(image); 
      if (uploadResult.success) {
        imageUrl = uploadResult.url; 
      } else {
        throw new Error(uploadResult.error);
      }
    }

    const postData = {
      text,
      createdAt: serverTimestamp(),
      authorId: auth.currentUser.uid,
      authorName: auth.currentUser.displayName || 'Anonymous',
      authorEmail: auth.currentUser.email,
      authorPhoto: userData.photoURL || null,
      image: imageUrl, 
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
    console.error('Error creating post:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const deletePost = async (postId) => {
  try {
    const docRef = doc(db, 'posts', postId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: error.message };
  }
};

export const updatePost = async (postId, newText) => {
  try {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, {
      text: newText,
      editedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, error: error.message };
  }
};