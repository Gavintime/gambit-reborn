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
import * as cg from 'chessground/types'

export class Chess {
  private chessjs = new Chessjs()
  private ground: Api

  constructor(
    boardElement: HTMLElement,
    clientMoveCallback: (lastMove: string) => void
  ) {
    const initialGroundConfig: Config = {
      coordinates: false,
      movable: { free: false },
      events: {
        move: (orig: cg.Key, dest: cg.Key, capturedPiece?: cg.Piece): void => {
          this.moveCallBack(orig, dest)
          // TODO: fix tsconfig
          const lastMove = this.chessjs.history({verbose: true}).at(-1).lan
          clientMoveCallback(lastMove)
        }
      }
    }
    this.ground = Chessground(boardElement, initialGroundConfig)
    this.setGroundLegalMoves()
  }

  /**
   * Sets the ground's moves to the current chessjs moves
   */
  private setGroundLegalMoves() {
    const moveMap = new Map<Square, Square[]>()

    const moves = this.chessjs.moves({ verbose: true })

    for (const move of moves) {
      if (!moveMap.has(move.from)) {
        moveMap.set(move.from, [])
      }
      moveMap.get(move.from)!.push(move.to)
    }

    this.ground.set({ movable: { dests: moveMap } })
  }

  /**
   * this syncs chess.js with chessground after the user makes a move using chessground
   * 
   * Returns the move notation from chess.js, this will be forwarded
   */
  private moveCallBack(orig: cg.Key, dest: cg.Key): void {
    // TODO: assuming the user's move is already legal due to setGroundLegalMoves() restricting ground moves
    this.chessjs.move({
      from: orig,
      to: dest,
      // TODO: selectable promotion
      promotion: 'q'
    })

    // TODO: move this to a universal "update ground" function?
    // this is needed when promoting to set the promoted piece visual
    this.ground.set({ fen: this.chessjs.fen() })

    this.setGroundLegalMoves()
  }
}
