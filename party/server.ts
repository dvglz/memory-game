import type * as Party from "partykit/server";

// V1 Fixed Settings
const GAME_CONFIG = {
  pairs: 10,
  timer: 15, // seconds per turn
  flipDelay: 1000, // ms before cards flip back
  reconnectTimeout: 30000, // 30s to reconnect
};

// NBA Teams for V1
const NBA_TEAMS = [
  "NBA_ATL", "NBA_BKN", "NBA_BOS", "NBA_CHA", "NBA_CHI", "NBA_CLE",
  "NBA_DAL", "NBA_DEN", "NBA_DET", "NBA_GSW", "NBA_HOU", "NBA_IND",
  "NBA_LAC", "NBA_LAL", "NBA_MEM", "NBA_MIA", "NBA_MIL", "NBA_MIN",
  "NBA_NOP", "NBA_NYK", "NBA_OKC", "NBA_ORL", "NBA_PHI", "NBA_PHX",
  "NBA_POR", "NBA_SAC", "NBA_SAS", "NBA_TOR", "NBA_UTA", "NBA_WAS",
];

interface ServerCard {
  id: string;
  face: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface ServerPlayer {
  id: string;
  name: string;
  connected: boolean;
  score: number;
}

type RoomStatus = "waiting" | "playing" | "finished" | "abandoned";

interface ServerState {
  roomCode: string;
  status: RoomStatus;
  players: ServerPlayer[];
  cards: ServerCard[];
  currentPlayerIndex: number;
  timer: number;
  winner: ServerPlayer | null;
  flippedCardIds: string[]; // Track currently flipped (not matched) cards
}

// Messages
interface JoinMessage {
  type: "JOIN";
  playerName: string;
}

interface FlipCardMessage {
  type: "FLIP_CARD";
  cardId: string;
}

type ClientMessage = JoinMessage | FlipCardMessage | { type: "READY" };

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generateCards(): ServerCard[] {
  const selectedTeams = shuffle(NBA_TEAMS).slice(0, GAME_CONFIG.pairs);
  const cards: ServerCard[] = [
    ...selectedTeams.map((team, i) => ({
      id: `card-${i}-a`,
      face: team,
      isFlipped: false,
      isMatched: false,
    })),
    ...selectedTeams.map((team, i) => ({
      id: `card-${i}-b`,
      face: team,
      isFlipped: false,
      isMatched: false,
    })),
  ];
  return shuffle(cards);
}

export default class GameRoom implements Party.Server {
  state: ServerState;
  timerInterval: ReturnType<typeof setInterval> | null = null;
  disconnectTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  flipDelayTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(readonly room: Party.Room) {
    this.state = {
      roomCode: room.id,
      status: "waiting",
      players: [],
      cards: [],
      currentPlayerIndex: 0,
      timer: GAME_CONFIG.timer,
      winner: null,
      flippedCardIds: [],
    };
  }

  // Get client-safe state (hide card faces that shouldn't be revealed)
  getClientState(playerId: string) {
    const myPlayerIndex = this.state.players.findIndex((p) => p.id === playerId);
    
    return {
      roomCode: this.state.roomCode,
      status: this.state.status,
      players: this.state.players,
      cards: this.state.cards.map((card) => ({
        id: card.id,
        // Only reveal face if card is flipped or matched
        face: card.isFlipped || card.isMatched ? card.face : null,
        isFlipped: card.isFlipped,
        isMatched: card.isMatched,
      })),
      currentPlayerIndex: this.state.currentPlayerIndex,
      timer: this.state.timer,
      myPlayerIndex,
      winner: this.state.winner,
    };
  }

  broadcastState() {
    for (const conn of this.room.getConnections()) {
      const playerId = conn.id;
      conn.send(
        JSON.stringify({
          type: "STATE_SYNC",
          state: this.getClientState(playerId),
        })
      );
    }
  }

  startGame() {
    this.state.cards = generateCards();
    this.state.status = "playing";
    this.state.currentPlayerIndex = 0;
    this.state.timer = GAME_CONFIG.timer;
    this.state.flippedCardIds = [];

    // Start turn timer
    this.startTimer();

    // Broadcast game start
    for (const conn of this.room.getConnections()) {
      conn.send(
        JSON.stringify({
          type: "GAME_START",
          state: this.getClientState(conn.id),
        })
      );
    }
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      if (this.state.status !== "playing") {
        this.stopTimer();
        return;
      }

      this.state.timer--;

      if (this.state.timer <= 0) {
        // Time's up - flip cards back and switch turn
        this.handleTimeUp();
      }

      this.broadcastState();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  handleTimeUp() {
    // Reset any flipped cards
    for (const cardId of this.state.flippedCardIds) {
      const card = this.state.cards.find((c) => c.id === cardId);
      if (card) card.isFlipped = false;
    }
    this.state.flippedCardIds = [];

    // Switch turn
    this.state.currentPlayerIndex =
      (this.state.currentPlayerIndex + 1) % this.state.players.length;
    this.state.timer = GAME_CONFIG.timer;
  }

  handleFlipCard(playerId: string, cardId: string) {
    // Validate it's this player's turn
    const playerIndex = this.state.players.findIndex((p) => p.id === playerId);
    if (playerIndex !== this.state.currentPlayerIndex) {
      return; // Not your turn
    }

    // Can't flip if already processing (2 cards flipped)
    if (this.state.flippedCardIds.length >= 2) {
      return;
    }

    // Find the card
    const card = this.state.cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) {
      return; // Invalid card
    }

    // Flip the card
    card.isFlipped = true;
    this.state.flippedCardIds.push(cardId);

    // If two cards are now flipped, check for match
    if (this.state.flippedCardIds.length === 2) {
      const [id1, id2] = this.state.flippedCardIds;
      const card1 = this.state.cards.find((c) => c.id === id1)!;
      const card2 = this.state.cards.find((c) => c.id === id2)!;

      this.broadcastState();

      // Schedule the match check
      this.flipDelayTimeout = setTimeout(() => {
        this.processMatch(card1, card2, playerIndex);
      }, GAME_CONFIG.flipDelay);
    } else {
      this.broadcastState();
    }
  }

  processMatch(card1: ServerCard, card2: ServerCard, playerIndex: number) {
    const isMatch = card1.face === card2.face;

    if (isMatch) {
      // Mark as matched
      card1.isMatched = true;
      card2.isMatched = true;

      // Add score
      this.state.players[playerIndex].score++;

      // Reset timer for next flip
      this.state.timer = GAME_CONFIG.timer;

      // Check for game over
      const allMatched = this.state.cards.every((c) => c.isMatched);
      if (allMatched) {
        this.endGame("complete");
        return;
      }
    } else {
      // Flip cards back
      card1.isFlipped = false;
      card2.isFlipped = false;

      // Switch turn
      this.state.currentPlayerIndex =
        (this.state.currentPlayerIndex + 1) % this.state.players.length;
      this.state.timer = GAME_CONFIG.timer;
    }

    // Clear flipped tracking
    this.state.flippedCardIds = [];

    this.broadcastState();
  }

  endGame(reason: "complete" | "forfeit" | "disconnect") {
    this.state.status = "finished";
    this.stopTimer();

    // Determine winner
    const sorted = [...this.state.players].sort((a, b) => b.score - a.score);
    if (sorted.length >= 2 && sorted[0].score > sorted[1].score) {
      this.state.winner = sorted[0];
    } else {
      this.state.winner = null; // Tie
    }

    for (const conn of this.room.getConnections()) {
      conn.send(
        JSON.stringify({
          type: "GAME_OVER",
          winner: this.state.winner,
          reason,
          state: this.getClientState(conn.id),
        })
      );
    }
  }

  onConnect(conn: Party.Connection) {
    // Send current state on connect (useful for reconnection)
    conn.send(
      JSON.stringify({
        type: "STATE_SYNC",
        state: this.getClientState(conn.id),
      })
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    let parsed: ClientMessage;
    try {
      parsed = JSON.parse(message);
    } catch {
      return;
    }

    switch (parsed.type) {
      case "JOIN":
        this.handleJoin(sender, parsed.playerName);
        break;
      case "FLIP_CARD":
        this.handleFlipCard(sender.id, parsed.cardId);
        break;
      case "READY":
        // Could be used for lobby ready-up, but for now we auto-start
        break;
    }
  }

  handleJoin(conn: Party.Connection, playerName: string) {
    // Check if this is a reconnection
    const existingPlayer = this.state.players.find((p) => p.id === conn.id);
    if (existingPlayer) {
      // Reconnection
      existingPlayer.connected = true;
      
      // Clear disconnect timer
      const timer = this.disconnectTimers.get(conn.id);
      if (timer) {
        clearTimeout(timer);
        this.disconnectTimers.delete(conn.id);
      }

      // Notify others
      for (const c of this.room.getConnections()) {
        c.send(
          JSON.stringify({
            type: "RECONNECTED",
            playerId: conn.id,
          })
        );
      }

      this.broadcastState();
      return;
    }

    // Room full?
    if (this.state.players.length >= 2) {
      conn.send(
        JSON.stringify({
          type: "ERROR",
          message: "Room is full",
        })
      );
      return;
    }

    // Game already in progress?
    if (this.state.status === "playing") {
      conn.send(
        JSON.stringify({
          type: "ERROR",
          message: "Game already in progress",
        })
      );
      return;
    }

    // Add player
    const newPlayer: ServerPlayer = {
      id: conn.id,
      name: playerName || `Player ${this.state.players.length + 1}`,
      connected: true,
      score: 0,
    };
    this.state.players.push(newPlayer);

    // Notify about player joined
    for (const c of this.room.getConnections()) {
      c.send(
        JSON.stringify({
          type: "PLAYER_JOINED",
          player: newPlayer,
        })
      );
    }

    this.broadcastState();

    // If we have 2 players, start the game
    if (this.state.players.length === 2) {
      // Small delay before starting
      setTimeout(() => {
        this.startGame();
      }, 1500);
    }
  }

  onClose(conn: Party.Connection) {
    const player = this.state.players.find((p) => p.id === conn.id);
    if (!player) return;

    player.connected = false;

    // Notify opponent
    for (const c of this.room.getConnections()) {
      c.send(
        JSON.stringify({
          type: "PLAYER_LEFT",
          playerId: conn.id,
          reconnectDeadline: Date.now() + GAME_CONFIG.reconnectTimeout,
        })
      );
    }

    // Start disconnect timer
    const timer = setTimeout(() => {
      // Player didn't reconnect - forfeit
      if (this.state.status === "playing") {
        this.endGame("disconnect");
      } else {
        // Remove player from waiting room
        this.state.players = this.state.players.filter((p) => p.id !== conn.id);
        this.broadcastState();
      }
      this.disconnectTimers.delete(conn.id);
    }, GAME_CONFIG.reconnectTimeout);

    this.disconnectTimers.set(conn.id, timer);
  }

  onError(conn: Party.Connection, error: Error) {
    console.error(`Connection error for ${conn.id}:`, error);
  }
}
