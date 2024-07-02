/**
 * This is a wrapper over chess.js and chessground to create a legal client side chess board view
 * It emits the user's chess move to the given callback (sent to the socket io server)
 */
// TODO: disable moves when not the user's turn
// TODO: account for endgame end states
import { Chess as Chessjs, type Square } from 'chess.js'
import { Chessground } from 'chessground'
import type { Config } from 'chessground/config'
import type { Api } from 'chessground/api'
import type * as cg from 'chessground/types'

export class Chess {
  private chessjs = new Chessjs()
  private ground: Api

  constructor(
    boardElement: HTMLElement,
    private customCallBack: (
      from: Square,
      to: Square,
      promotion: 'b' | 'q' | 'n' | 'r' | undefined
    ) => void
  ) {
    const initialGroundConfig: Config = {
      coordinates: false,
      movable: { free: false },
      events: {
        move: (orig: cg.Key, dest: cg.Key) => this.processGroundMove(orig, dest)
        // move: this.processGroundMove
      }
    }
    this.ground = Chessground(boardElement, initialGroundConfig)
    this.setGroundtoChessJs()
  }

  /**
   * Sets chessground to the current chessjs fen, then sets legal ground moves
   */
  private setGroundtoChessJs() {
    this.ground.set({ fen: this.chessjs.fen() })

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
  private processGroundMove(orig: cg.Key, dest: cg.Key): void {
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

    this.customCallBack(orig, dest, promotion)
  }
}
