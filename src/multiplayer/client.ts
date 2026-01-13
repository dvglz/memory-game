import PartySocket from "partysocket";
import type { RoomState, ServerMessage, ClientMessage } from "./types";

// PartyKit host - change for production
const PARTYKIT_HOST =
  import.meta.env.VITE_PARTYKIT_HOST || "localhost:1999";

type ConnectionStatus = "disconnected" | "connecting" | "connected";

type StateUpdateCallback = (state: RoomState) => void;
type StatusChangeCallback = (status: ConnectionStatus) => void;
type MessageCallback = (message: ServerMessage) => void;

class MultiplayerClient {
  private socket: PartySocket | null = null;
  private roomCode: string | null = null;
  private playerName: string = "";
  private onStateUpdate: StateUpdateCallback | null = null;
  private onStatusChange: StatusChangeCallback | null = null;
  private onMessage: MessageCallback | null = null;
  private status: ConnectionStatus = "disconnected";

  // Generate a random room code
  static generateRoomCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing chars
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  // Create a new room and return the code
  async createRoom(playerName: string): Promise<string> {
    const roomCode = MultiplayerClient.generateRoomCode();
    await this.connect(roomCode, playerName);
    return roomCode;
  }

  // Join an existing room
  async joinRoom(roomCode: string, playerName: string): Promise<void> {
    await this.connect(roomCode.toUpperCase(), playerName);
  }

  private async connect(roomCode: string, playerName: string): Promise<void> {
    this.roomCode = roomCode;
    this.playerName = playerName;
    this.setStatus("connecting");

    return new Promise((resolve, reject) => {
      this.socket = new PartySocket({
        host: PARTYKIT_HOST,
        room: roomCode,
      });

      const timeout = setTimeout(() => {
        this.disconnect();
        reject(new Error("Connection timeout"));
      }, 10000);

      this.socket.addEventListener("open", () => {
        clearTimeout(timeout);
        this.setStatus("connected");

        // Send join message
        this.send({
          type: "JOIN",
          playerName: this.playerName,
        });

        resolve();
      });

      this.socket.addEventListener("message", (event) => {
        try {
          const message: ServerMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (e) {
          console.error("Failed to parse message:", e);
        }
      });

      this.socket.addEventListener("close", () => {
        this.setStatus("disconnected");
      });

      this.socket.addEventListener("error", (e) => {
        console.error("WebSocket error:", e);
        clearTimeout(timeout);
        reject(new Error("Connection failed"));
      });
    });
  }

  private handleMessage(message: ServerMessage) {
    // Call general message handler
    this.onMessage?.(message);

    // Handle state sync specifically
    if (message.type === "STATE_SYNC" || message.type === "GAME_START") {
      this.onStateUpdate?.(message.state);
    }

    if (message.type === "GAME_OVER" && "state" in message) {
      this.onStateUpdate?.(message.state as RoomState);
    }
  }

  private setStatus(status: ConnectionStatus) {
    this.status = status;
    this.onStatusChange?.(status);
  }

  // Send a message to the server
  send(message: ClientMessage) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  // Flip a card
  flipCard(cardId: string) {
    this.send({
      type: "FLIP_CARD",
      cardId,
    });
  }

  // Disconnect from the room
  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.roomCode = null;
    this.setStatus("disconnected");
  }

  // Set callbacks
  setOnStateUpdate(callback: StateUpdateCallback | null) {
    this.onStateUpdate = callback;
  }

  setOnStatusChange(callback: StatusChangeCallback | null) {
    this.onStatusChange = callback;
  }

  setOnMessage(callback: MessageCallback | null) {
    this.onMessage = callback;
  }

  // Getters
  getRoomCode() {
    return this.roomCode;
  }

  getStatus() {
    return this.status;
  }

  isConnected() {
    return this.status === "connected";
  }
}

// Singleton instance
export const multiplayerClient = new MultiplayerClient();
export type { ConnectionStatus };
