import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase/config';
import { useNavigate, useParams } from 'react-router-dom';
import { sendMessage, fetchChatHistory } from '../services/chatService';
import { fetchUserProfile } from '../services/profileService';
import defaultProfileImage from "../assets/profile/default_profile_image.jpg";
import '../css/Chat.css';
import { onSnapshot, query, collection, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const { userId } = useParams(); // userId of the person to chat with
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    const loadChatData = async () => {
      try {
        setLoading(true);
        // Fetch chat user's profile
        if (userId) {
          const userResult = await fetchUserProfile(userId);
          if (userResult.success) {
            setChatUser(userResult.data);
          }
        }

        // Set up real-time listener for messages
        const unsubscribe = onSnapshot(
          query(
            collection(db, 'chats'),
            where('senderId', 'in', [auth.currentUser.uid, userId]),
            where('receiverId', 'in', [auth.currentUser.uid, userId]),
            orderBy('createdAt', 'asc')
          ),
          (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate().toLocaleString()
            }));
            setMessages(messages);
            setLoading(false);
          },
          (error) => {
            console.error("Chat subscription error:", error);
            setError('Failed to load messages');
            setLoading(false);
          }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        setError('Failed to load chat data');
        setLoading(false);
      }
    };

    loadChatData();
  }, [userId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const result = await sendMessage(auth.currentUser.uid, userId, newMessage.trim());
      if (result.success) {
        setNewMessage('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to send message');
    }
  };

  if (loading) {
    return <div className="loading">Loading chat...</div>;
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        {chatUser && (
          <div className="chat-user-info">
            <img 
              src={chatUser.photoURL || defaultProfileImage} 
              alt={chatUser.fullName}
              className="chat-user-photo"
            />
            <h3>{chatUser.fullName}</h3>
          </div>
        )}
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message ${msg.senderId === auth.currentUser.uid ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{msg.message}</p>
                <span className="message-time">{msg.createdAt}</span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Chat; 