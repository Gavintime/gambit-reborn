import { io, Socket } from 'socket.io-client'
import type { Color, Square } from 'chess.js'

// TODO: put this in some shared location instead of copy pasting from the server
type SocketCallback = (response: null | string) => void

interface ServerToClientEvents {
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
  'game-started': () => void
  'game-state': (pgn: string) => void
}

interface ClientToServerEvents {
  'new-game': (inviteCode: string, userName: string, color: Color, callback: SocketCallback) => void
  'join-game': (inviteCode: string, userName: string, callback: SocketCallback) => void
  'make-move': (
    gameCode: string,
    userName: string,
    from: Square,
    to: Square,
    promotion: 'b' | 'q' | 'n' | 'r' | undefined,
    callback: SocketCallback
  ) => void
}

export class IoClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>
  private gameCode: string | null = null
  private userName: string | null = null
  private inGame: boolean = false

  constructor(
    gameStartedCallBack: () => void,
    gameStateCallback: (pgn: string) => void
  ) {
    this.socket = io('ws://localhost:3001')

    this.socket.on('connect', () => {
      console.log('connected to socket io server')
    })

    this.socket.on('game-started', () => {
      gameStartedCallBack()
      console.log('game started')
      this.inGame = true
    })

    this.socket.on('game-state', (pgn: string) => {
      gameStateCallback(pgn)
    })
  }

  /**
   * Sends a request to the server to create a new game
   */
  public newGame(inviteCode: string, userName: string, color: Color) {
    this.gameCode = inviteCode
    this.userName = userName

    this.socket.emit('new-game', inviteCode, userName, color, (response) => {
      // TODO: rethink responses
      if (response !== null) {
        console.error(response)
      }
    })
  }

  /**
   * Sends a request to the server to create a new game
   */
  public joinGame(inviteCode: string, userName: string) {
    this.gameCode = inviteCode
    this.userName = userName

    this.socket.emit('join-game', inviteCode, userName, (response) => {
      // TODO: rethink responses
      if (response !== null) {
        console.error(response)
      }
    })
  }

  public makeMove(from: Square, to: Square, promotion: 'b' | 'q' | 'n' | 'r' | undefined) {
    if (!this.inGame) {
      throw new Error('Game has not started yet')
    }

    this.socket.emit(
      'make-move',
      // must be set if we are already in game
      this.gameCode!,
      this.userName!,
      from,
      to,
      promotion,
      (response) => {
        if (response) {
          throw new Error(response)
        }
      }
    )
  }
}
