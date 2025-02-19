import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io('http://localhost:3001', {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    // Set up socket event handlers
    socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendMessage = (to, message) => {
  if (socket) {
    socket.emit('private_message', { to, message });
  }
};

export const joinChat = (userData) => {
  if (socket) {
    socket.emit('user_join', userData);
  }
}; 