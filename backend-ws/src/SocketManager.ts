import { WebSocket } from "ws";

export class User {
  public socket: WebSocket;
  public userId: string;
  constructor(socket: WebSocket, userId: string) {
    this.socket = socket;
    this.userId = userId;
  }
}

export class SocketManager {
  private static instance: SocketManager;
  private interestedSocket: Map<string, User[]>;
  private interestedRoom: Map<string, string>;
  private constructor() {
    this.interestedSocket = new Map<string, User[]>();
    this.interestedRoom = new Map<string, string>();
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new SocketManager();
    return this.instance;
  }
  addUser(user: User, roomId: string) {
    this.interestedSocket.set(roomId, [
      ...(this.interestedSocket.get(roomId) || []),
      user,
    ]);
    this.interestedRoom.set(user.userId, roomId);
  }
  broadCast(roomId: string, message: string) {
    const users = this.interestedSocket.get(roomId);
    if (!users) {
      console.log("No User Found");
      return;
    }
    users.forEach((user) => {
      user.socket.send(message);
    });
  }
}
