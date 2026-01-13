import { useState, useEffect, useCallback, useRef } from "react";
import { multiplayerClient, type ConnectionStatus } from "./client";
import type { RoomState, ServerMessage, OnlinePlayer } from "./types";

export interface UseMultiplayerReturn {
  // Connection
  status: ConnectionStatus;
  isConnected: boolean;
  error: string | null;

  // Room info
  roomCode: string | null;
  roomState: RoomState | null;

  // Player info
  isHost: boolean;
  myPlayerIndex: number;
  opponent: OnlinePlayer | null;
  isMyTurn: boolean;

  // Opponent status
  opponentDisconnected: boolean;
  reconnectDeadline: number | null;

  // Actions
  createRoom: (playerName: string) => Promise<string>;
  joinRoom: (code: string, playerName: string) => Promise<void>;
  flipCard: (cardId: string) => void;
  disconnect: () => void;
}

export function useMultiplayer(): UseMultiplayerReturn {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [reconnectDeadline, setReconnectDeadline] = useState<number | null>(null);

  // Track if we've set up listeners
  const listenersSetup = useRef(false);

  useEffect(() => {
    if (listenersSetup.current) return;
    listenersSetup.current = true;

    multiplayerClient.setOnStatusChange((newStatus) => {
      setStatus(newStatus);
      if (newStatus === "disconnected") {
        setRoomCode(null);
      }
    });

    multiplayerClient.setOnStateUpdate((state) => {
      setRoomState(state);
      setError(null);
    });

    multiplayerClient.setOnMessage((message: ServerMessage) => {
      switch (message.type) {
        case "ERROR":
          setError(message.message);
          break;
        case "PLAYER_LEFT":
          setOpponentDisconnected(true);
          setReconnectDeadline(message.reconnectDeadline);
          break;
        case "RECONNECTED":
          setOpponentDisconnected(false);
          setReconnectDeadline(null);
          break;
        case "PLAYER_JOINED":
          setOpponentDisconnected(false);
          setReconnectDeadline(null);
          break;
      }
    });

    return () => {
      multiplayerClient.setOnStatusChange(null);
      multiplayerClient.setOnStateUpdate(null);
      multiplayerClient.setOnMessage(null);
      listenersSetup.current = false;
    };
  }, []);

  const createRoom = useCallback(async (playerName: string): Promise<string> => {
    setError(null);
    try {
      const code = await multiplayerClient.createRoom(playerName);
      setRoomCode(code);
      return code;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create room";
      setError(msg);
      throw e;
    }
  }, []);

  const joinRoom = useCallback(async (code: string, playerName: string): Promise<void> => {
    setError(null);
    try {
      await multiplayerClient.joinRoom(code, playerName);
      setRoomCode(code.toUpperCase());
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to join room";
      setError(msg);
      throw e;
    }
  }, []);

  const flipCard = useCallback((cardId: string) => {
    multiplayerClient.flipCard(cardId);
  }, []);

  const disconnect = useCallback(() => {
    multiplayerClient.disconnect();
    setRoomState(null);
    setRoomCode(null);
    setError(null);
    setOpponentDisconnected(false);
    setReconnectDeadline(null);
  }, []);

  // Derived state
  const isConnected = status === "connected";
  const myPlayerIndex = roomState?.myPlayerIndex ?? -1;
  const isHost = myPlayerIndex === 0;
  const isMyTurn = roomState?.currentPlayerIndex === myPlayerIndex;

  const opponent = roomState?.players.find((_, i) => i !== myPlayerIndex) ?? null;

  return {
    status,
    isConnected,
    error,
    roomCode,
    roomState,
    isHost,
    myPlayerIndex,
    opponent,
    isMyTurn,
    opponentDisconnected,
    reconnectDeadline,
    createRoom,
    joinRoom,
    flipCard,
    disconnect,
  };
}
