import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  Loader2,
  Wifi,
  WifiOff,
  Users,
} from "lucide-react";
import type { UseMultiplayerReturn } from "../multiplayer";

type LobbyView = "menu" | "create" | "join" | "waiting" | "playing";

interface LobbyScreenProps {
  onBack: () => void;
  onGameStart: () => void;
  multiplayer: UseMultiplayerReturn;
}

export const LobbyScreen = ({ onBack, onGameStart, multiplayer }: LobbyScreenProps) => {
  const [view, setView] = useState<LobbyView>("menu");
  const [playerName, setPlayerName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    status,
    error,
    roomCode,
    roomState,
    isHost,
    opponent,
    opponentDisconnected,
    reconnectDeadline,
    createRoom,
    joinRoom,
    disconnect,
  } = multiplayer;

  // When game starts, notify parent
  useEffect(() => {
    if (roomState?.status === "playing" && view !== "playing") {
      setView("playing");
      onGameStart();
    }
  }, [roomState?.status, view, onGameStart]);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) return;
    setIsLoading(true);
    try {
      await createRoom(playerName.trim());
      setView("waiting");
    } catch {
      // Error is in hook state
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim() || !joinCode.trim()) return;
    setIsLoading(true);
    try {
      await joinRoom(joinCode.trim(), playerName.trim());
      setView("waiting");
    } catch {
      // Error is in hook state
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBack = () => {
    if (view === "menu") {
      onBack();
    } else if (view === "waiting") {
      disconnect();
      setView("menu");
    } else {
      setView("menu");
    }
  };

  // Reconnect countdown
  const getReconnectSeconds = () => {
    if (!reconnectDeadline) return 0;
    return Math.max(0, Math.ceil((reconnectDeadline - Date.now()) / 1000));
  };

  return (
    <div className="h-dvh w-full flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <header className="shrink-0 p-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        {/* Logo */}
        <div className="w-48 md:w-64">
          <img
            src="/assets/misc/miss-match_logo-full.webp"
            alt="Miss Match"
            className="w-full h-auto"
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Menu View */}
          {view === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm flex flex-col gap-4"
            >
              <h2 className="text-xl font-black uppercase text-center text-white mb-2">
                Play Online
              </h2>

              {/* Name Input */}
              <input
                type="text"
                placeholder="Your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-nba-orange transition-colors text-center font-medium"
              />

              {/* Create Room */}
              <button
                onClick={() => {
                  if (playerName.trim()) {
                    setView("create");
                    handleCreateRoom();
                  }
                }}
                disabled={!playerName.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-b from-nba-red to-red-700 border-2 border-nba-orange/50 text-white font-black uppercase tracking-tight hover:border-nba-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Create Room
              </button>

              {/* Join Room */}
              <button
                onClick={() => setView("join")}
                disabled={!playerName.trim()}
                className="w-full py-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-black uppercase tracking-tight hover:bg-zinc-700 hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Join Room
              </button>
            </motion.div>
          )}

          {/* Create View (transitions to waiting) */}
          {view === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm flex flex-col items-center gap-6"
            >
              <Loader2 className="w-8 h-8 text-nba-orange animate-spin" />
              <p className="text-zinc-400 text-center">Creating room...</p>
            </motion.div>
          )}

          {/* Join View */}
          {view === "join" && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm flex flex-col gap-4"
            >
              <h2 className="text-xl font-black uppercase text-center text-white mb-2">
                Join Room
              </h2>

              <input
                type="text"
                placeholder="Enter room code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full px-4 py-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-nba-orange transition-colors text-center font-mono text-2xl tracking-[0.3em] uppercase"
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                onClick={handleJoinRoom}
                disabled={!joinCode.trim() || joinCode.length < 6 || isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-b from-nba-red to-red-700 border-2 border-nba-orange/50 text-white font-black uppercase tracking-tight hover:border-nba-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Join"
                )}
              </button>
            </motion.div>
          )}

          {/* Waiting View */}
          {view === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm flex flex-col items-center gap-6"
            >
              {/* Connection Status */}
              <div className="flex items-center gap-2 text-sm">
                {status === "connected" ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-500" />
                    <span className="text-red-500">Disconnected</span>
                  </>
                )}
              </div>

              {/* Room Code */}
              {roomCode && isHost && (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-zinc-400 text-sm">Share this code:</p>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-3 px-6 py-4 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors group"
                  >
                    <span className="font-mono text-3xl tracking-[0.3em] text-white">
                      {roomCode}
                    </span>
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              )}

              {/* Players */}
              <div className="w-full flex flex-col gap-3">
                <p className="text-zinc-500 text-xs uppercase tracking-wider text-center">
                  Players
                </p>
                <div className="flex gap-3">
                  {/* Player 1 (Host) */}
                  <div
                    className={`flex-1 p-4 rounded-xl border-2 ${
                      isHost
                        ? "bg-nba-red/20 border-nba-orange/50"
                        : "bg-zinc-800 border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-zinc-400" />
                      <span className="text-white font-medium truncate">
                        {roomState?.players[0]?.name || "Waiting..."}
                      </span>
                    </div>
                    {isHost && (
                      <span className="text-[10px] text-nba-orange uppercase mt-1 block">
                        You (Host)
                      </span>
                    )}
                  </div>

                  {/* Player 2 (Guest) */}
                  <div
                    className={`flex-1 p-4 rounded-xl border-2 ${
                      !isHost && roomState?.players[1]
                        ? "bg-nba-red/20 border-nba-orange/50"
                        : "bg-zinc-800 border-zinc-700"
                    }`}
                  >
                    {opponent ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-zinc-400" />
                          <span className="text-white font-medium truncate">
                            {opponent.name}
                          </span>
                        </div>
                        {!isHost && (
                          <span className="text-[10px] text-nba-orange uppercase mt-1 block">
                            You
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                        <span className="text-zinc-500">Waiting...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Opponent Disconnected Warning */}
              {opponentDisconnected && (
                <div className="w-full p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-center">
                  <p className="text-yellow-500 text-sm">
                    Opponent disconnected. Reconnecting...
                  </p>
                  <p className="text-yellow-500/70 text-xs mt-1">
                    {getReconnectSeconds()}s remaining
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Starting Soon */}
              {opponent && !opponentDisconnected && (
                <div className="flex items-center gap-2 text-nba-orange">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Starting game...</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="shrink-0 p-4 text-center">
        <p className="text-zinc-600 text-xs">
          Online multiplayer • V1
        </p>
      </footer>
    </div>
  );
};
