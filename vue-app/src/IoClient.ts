import { io, Socket } from 'socket.io-client'
import type { Color, PieceSymbol, Square } from 'chess.js'

// TODO: put this in some shared location instead of copy pasting from the server
type SocketCallback = (response: null | string) => void

interface ServerToClientEvents {
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
  'game-started': () => void
  'game-state': (moveNumber: number, color: Color, move: string) => void
}

interface ClientToServerEvents {
  'new-game': (inviteCode: string, userName: string, color: Color, callback: SocketCallback) => void
  'join-game': (inviteCode: string, userName: string, callback: SocketCallback) => void
  'make-move': (
    gameCode: string,
    userName: string,
    from: Square,
    to: Square,
    promotion: PieceSymbol | null,
    callback: SocketCallback
  ) => void
}

export class IoClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>

  constructor() {
    this.socket = io('ws://localhost:3001')

    this.socket.on('connect', () => {
      console.log('connected to socket io server')
    })

    this.socket.on('game-started', () => {
      // TODO: reset board
    })

    this.socket.on('game-state', (moveNumber, color, move) => {
      // TODO: sink state with client (only if states are different)
    })
  }

  /**
   * Sends a request to the server to create a new game
   */
  public newGame(inviteCode: string, userName: string, color: Color) {
    this.socket.emit('new-game', inviteCode, userName, color, (response) => {
      // TODO: rethink responses
      if (response !== null) {
        console.error(response)
      }
    })
  }
}
