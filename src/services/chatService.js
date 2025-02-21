import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';

export const sendMessage = async (senderId, receiverId, message) => {
  try {
    const chatData = {
      senderId,
      receiverId,
      message,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'chats'), chatData);
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: error.message };
  }
};

export const fetchChatHistory = async (userId1, userId2) => {
  try {
    // First query: userId1 as sender, userId2 as receiver
    const q1 = query(
      collection(db, 'chats'),
      where('senderId', '==', userId1),
      where('receiverId', '==', userId2),
      orderBy('createdAt', 'asc')
    );

    // Second query: userId2 as sender, userId1 as receiver
    const q2 = query(
      collection(db, 'chats'),
      where('senderId', '==', userId2),
      where('receiverId', '==', userId1),
      orderBy('createdAt', 'asc')
    );

    // Execute both queries
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ]);

    // Combine and sort messages
    const messages = [
      ...snapshot1.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString()
      })),
      ...snapshot2.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString()
      }))
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return { success: true, data: messages };
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToChats = (userId, callback) => {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toLocaleString()
    }));
    callback(messages);
  });
}; 