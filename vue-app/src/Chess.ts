import { Chess as Chessjs, type Square } from 'chess.js'
import { Chessground } from 'chessground'
import type { Config } from 'chessground/config'
import type { Api } from 'chessground/api'

export class Chess {
  private chessjs = new Chessjs()
  private ground: Api

  constructor(boardElement: HTMLElement) {
    const initialGroundConfig: Config = {
      coordinates: false,
      movable: { free: false }
    }
    this.ground = Chessground(boardElement, initialGroundConfig)
    this.setMoves()
  }

  /**
   * Sets the ground's moves to the current chessjs moves
   */
  private setMoves() {
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
}
