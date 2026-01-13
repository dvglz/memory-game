// Message types for client-server communication
export type MessageType =
  | "JOIN"
  | "READY"
  | "FLIP_CARD"
  | "STATE_SYNC"
  | "PLAYER_LEFT"
  | "PLAYER_JOINED"
  | "RECONNECTED"
  | "GAME_START"
  | "GAME_OVER"
  | "FORFEIT"
  | "ERROR";

// Card as seen by client (face hidden until revealed)
export interface ClientCard {
  id: string;
  face: string | null; // null until revealed by server
  isFlipped: boolean;
  isMatched: boolean;
}

// Player info
export interface OnlinePlayer {
  id: string;
  name: string;
  connected: boolean;
  score: number;
}

// Room status
export type RoomStatus = "waiting" | "playing" | "finished" | "abandoned";

// Client-side room state (received from server)
export interface RoomState {
  roomCode: string;
  status: RoomStatus;
  players: OnlinePlayer[];
  cards: ClientCard[];
  currentPlayerIndex: number;
  timer: number;
  myPlayerIndex: number; // Which player slot this client is
  winner: OnlinePlayer | null;
}

// Messages from client to server
export interface JoinMessage {
  type: "JOIN";
  playerName: string;
}

export interface FlipCardMessage {
  type: "FLIP_CARD";
  cardId: string;
}

export interface ReadyMessage {
  type: "READY";
}

export type ClientMessage = JoinMessage | FlipCardMessage | ReadyMessage;

// Messages from server to client
export interface StateSyncMessage {
  type: "STATE_SYNC";
  state: RoomState;
}

export interface PlayerJoinedMessage {
  type: "PLAYER_JOINED";
  player: OnlinePlayer;
}

export interface PlayerLeftMessage {
  type: "PLAYER_LEFT";
  playerId: string;
  reconnectDeadline: number; // timestamp
}

export interface ReconnectedMessage {
  type: "RECONNECTED";
  playerId: string;
}

export interface GameStartMessage {
  type: "GAME_START";
  state: RoomState;
}

export interface GameOverMessage {
  type: "GAME_OVER";
  winner: OnlinePlayer | null;
  reason: "complete" | "forfeit" | "disconnect";
}

export interface ErrorMessage {
  type: "ERROR";
  message: string;
}

export type ServerMessage =
  | StateSyncMessage
  | PlayerJoinedMessage
  | PlayerLeftMessage
  | ReconnectedMessage
  | GameStartMessage
  | GameOverMessage
  | ErrorMessage;
