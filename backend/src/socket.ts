import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer | null = null;

export const initializeSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Allow clients to join a specific room for their assessment
    socket.on('join_assessment_room', (assessmentId: string) => {
      socket.join(assessmentId);
      console.log(`[Socket] Client ${socket.id} joined room: ${assessmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};
