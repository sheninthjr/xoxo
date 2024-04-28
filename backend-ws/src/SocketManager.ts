import { randomUUID } from "crypto";
import { WebSocket } from "ws";

export class User {
  public socket: WebSocket;
  public id: string;

  constructor(socket: WebSocket) {
    this.socket = socket;
    this.id = randomUUID();
  }
}

export class SocketManager {
  private static instance: SocketManager;
  private interestedSockets: Map<string, User[]>;
  private userRoomMappping: Map<string, string>;

  private constructor() {
    this.interestedSockets = new Map<string, User[]>();
    this.userRoomMappping = new Map<string, string>();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new SocketManager();
    return this.instance;
  }

  addUser(user: User, roomId: string) {
    this.interestedSockets.set(roomId, [
      ...(this.interestedSockets.get(roomId) || []),
      user,
    ]);
    this.userRoomMappping.set(user.id, roomId);
    console.log(this.userRoomMappping);
  }

  broadcast(roomId: string, message: string) {
    const users = this.interestedSockets.get(roomId);
    if (!users) {
      console.error("No users in room?");
      return;
    }
    users.forEach((user) => {
      user.socket.send(message);
    });
  }
}
