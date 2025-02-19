import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { auth } from '../firebase/config';
import '../css/Chat.css';
import { initializeSocket } from '../services/chatserver.js';

// Replace direct socket initialization with service
const socket = initializeSocket();

function Chat({ recipientId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join chat when component mounts
    if (auth.currentUser) {
      socket.emit('user_join', {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
        userPhoto: auth.currentUser.photoURL
      });
    }

    // Listen for messages
    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for active users updates
    socket.on('active_users', (users) => {
      setActiveUsers(users);
    });

    return () => {
      socket.off('receive_message');
      socket.off('active_users');
    };
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit('private_message', {
        to: recipientId,
        message: newMessage.trim()
      });

      setMessages(prev => [...prev, {
        message: newMessage.trim(),
        from: auth.currentUser.uid,
        fromName: auth.currentUser.displayName,
        fromPhoto: auth.currentUser.photoURL,
        timestamp: new Date()
      }]);

      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.from === auth.currentUser.uid ? 'sent' : 'received'}`}
          >
            <img 
              src={msg.fromPhoto || '/default-avatar.png'} 
              alt={msg.fromName} 
              className="message-avatar"
            />
            <div className="message-content">
              <div className="message-header">
                <span className="message-author">{msg.fromName}</span>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
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
    </div>
  );
}

export default Chat; 