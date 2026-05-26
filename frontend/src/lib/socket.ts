import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL);
      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });
    }
  }

  joinRoom(assessmentId: string) {
    if (this.socket) {
      this.socket.emit('join_assessment_room', assessmentId);
    }
  }

  onAssessmentCompleted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('assessment_completed', callback);
    }
  }

  onAssessmentFailed(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('assessment_failed', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
