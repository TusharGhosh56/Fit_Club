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
  updateDoc,
  where
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

      
      const repliesQuery = query(collection(db, 'replies'), where('postId', '==', docSnapshot.id));
      const repliesSnapshot = await getDocs(repliesQuery);
      const replies = repliesSnapshot.docs.map(replyDoc => replyDoc.data().replyText);

      return {
        id: docSnapshot.id,
        ...postData,
        authorPhoto: authorData.photoURL || null,
        authorRole: authorData.role || 'User', 
        createdAt: postData.createdAt?.toDate().toLocaleString() || new Date().toLocaleString(),
        replies: replies 
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
      authorRole: userData.role || 'User', 
      authorPhoto: userData.photoURL || null,
      image: imageUrl, 
      likes: 0,
      comments: [],
      replies: []
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

export const saveReply = async (postId, replyText) => {
  try {
    const replyData = {
      postId: postId,
      replyText: replyText,
      createdAt: new Date(),
      userId: auth.currentUser.uid,
    };

    await addDoc(collection(db, 'replies'), replyData);
    return { success: true };
  } catch (error) {
    console.error('Error saving reply:', error);
    return { success: false, error: error.message };
  }
};
