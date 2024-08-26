/**
 * This is a wrapper over chess.js and chessground to create a legal client side chess board view
 * It emits the user's chess move to the given callback (sent to the socket io server)
 */
// TODO: disable moves when not the user's turn
// TODO: account for endgame end states
import { Chess as Chessjs, type Color, type Square } from 'chess.js'
import { Chessground } from 'chessground'
import type { Config } from 'chessground/config'
import type { Api } from 'chessground/api'
import type { Key } from 'chessground/types'

type ClientCallBack = (
  from: Square,
  to: Square,
  promotion: 'b' | 'q' | 'n' | 'r' | undefined
) => void

export class Chess {
  private chessjs = new Chessjs()
  private ground: Api
  private playerColor: Color
  /**
   * This is called when the user makes legal a move on chessground
   *
   * Used by the IoClient to send the move to the server
   */
  private clientMoveCallback: ClientCallBack

  constructor(boardElement: HTMLElement) {
    // dummy callback until user sets it
    this.clientMoveCallback = () => {}

    this.playerColor = 'w'

    const initialGroundConfig: Config = {
      coordinates: false,
      movable: { free: false },
      events: {
        move: (orig: Key, dest: Key) => this.processGroundMove(orig, dest)
        // move: this.processGroundMove
      }
    }
    this.ground = Chessground(boardElement, initialGroundConfig)
    this.startNewGame()
  }

  /**
   * Sets chessground and chessjs to a new game
   * @param color sets which side the chess board should face, defaults to white pov
   */
  public startNewGame(color: Color = 'w') {
    this.chessjs.reset()
    this.setGroundtoChessJs()

    this.playerColor = color
    if (color !== 'w') {
      this.ground.toggleOrientation()
    }
  }

  public setClientMoveCallback(callback: ClientCallBack) {
    this.clientMoveCallback = callback
  }

  /**
   * Applies the given info to the current game state
   *
   * This is used as a callback whenever IoClient gets game state
   */
  public updateGameState(pgn: string): void {
    // TODO: compare this using pgn
    // if (this.chessjs.fen() === fen) {
    //   console.warn('got duplicate game state data')
    //   return
    // }

    this.chessjs.loadPgn(pgn)
    this.setGroundtoChessJs()
  }

  /**
   * Sets chessground to the current chessjs fen, then sets legal ground moves
   */
  private setGroundtoChessJs() {
    this.ground.set({ fen: this.chessjs.fen() })

    // don't populate any moves if it's not the players turn
    if (this.playerColor !== this.chessjs.turn()) {
      this.ground.set({ movable: { dests: new Map() } })
      return
    }

    const groundMoves = new Map<Square, Square[]>()
    const chessJsMoves = this.chessjs.moves({ verbose: true })

    for (const move of chessJsMoves) {
      if (!groundMoves.has(move.from)) {
        groundMoves.set(move.from, [])
      }
      groundMoves.get(move.from)!.push(move.to)
    }

    this.ground.set({ movable: { dests: groundMoves } })
  }

  /**
   * Callback to process a move attempt from chessgrond.
   *
   * It validates the move attempt, updates chessjs and chessground, then calls the user's callback with move info.
   */
  private processGroundMove(orig: Key, dest: Key): void {
    if (orig === 'a0' || dest === 'a0') {
      throw new Error('Impossible chessground move ?!')
    }

    // TODO: check if promotion piece/square, then ask user for promotion piece
    const promotion = 'q'

    try {
      this.chessjs.move({
        from: orig,
        to: dest,
        promotion: promotion
      })
    } catch (error) {
      // illegal move, shouldn't happen since we restrict ground moves to legal moves, but just in case
      return
    } finally {
      // update ground even if the user tried an illegal move
      this.setGroundtoChessJs()
    }

    this.clientMoveCallback(orig, dest, promotion)
  }
}
