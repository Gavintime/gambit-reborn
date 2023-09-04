<script setup lang="ts">

// Ranks are indexed in reverse order so they render correctly in v-for loops
enum Rank {
  r1 = 7,
  r2 = 6,
  r3 = 5,
  r4 = 4,
  r5 = 3,
  r6 = 2,
  r7 = 1,
  r8 = 0
}

enum File {
  A = 0,
  B,
  C,
  D,
  E,
  F,
  G,
  H
}

enum Piece {
  BlackBishop = 'bB',
  BlackKing = 'bK',
  BlackKnight = 'bN',
  BlackPawn = 'bP',
  BlackQueen = 'bQ',
  BlackRook = 'bR',
  WhiteBishop = 'wB',
  WhiteKing = 'wK',
  WhiteKnight = 'wN',
  WhitePawn = 'wP',
  WhiteQueen = 'wQ',
  WhiteRook = 'wR'
}

type Square = Piece | null

class ChessBoard {
  // 8x8
  squares: Square[][]
  turn: 'WHITE' | 'BLACK' = 'WHITE'
  whiteCastle = true
  blackCastle = true
  enPassantSquare: Square | null = null

  constructor () {
    this.squares = []

    // create ranks
    for (let i = 0; i < 8; i++) {
      this.squares[i] = []
      // create squares
      for (let j = 0; j < 8; j++) {
        this.squares[i][j] = null
      }
    }
  }

  private clearBoard (): this {
    this.squares.forEach((row, rowIndex, squaresArray) => {
      row.forEach((_, colIndex) => {
        squaresArray[rowIndex][colIndex] = null
      })
    })
    return this
  }

  private setSquare (piece: Piece | null, file: File, rank: Rank): this {
    this.squares[rank][file] = piece
    return this
  }

  // does not do move validation
  movePiece (startFile: File, startRank: Rank, endFile: File, endRank: Rank): this {
    const tempPiece = this.squares[startRank][startFile]
    this.setSquare(null, startFile, startRank)
    this.setSquare(tempPiece, endFile, endRank)

    this.turn = this.turn === 'WHITE' ? 'BLACK' : 'WHITE'

    return this
  }

  setStartBoard (): this {
    this.turn = 'WHITE'
    this.whiteCastle = true
    this.blackCastle = true
    this.enPassantSquare = null
    this
      .clearBoard()
      .setSquare(Piece.WhiteRook, File.A, Rank.r1)
      .setSquare(Piece.WhiteKnight, File.B, Rank.r1)
      .setSquare(Piece.WhiteBishop, File.C, Rank.r1)
      .setSquare(Piece.WhiteQueen, File.D, Rank.r1)
      .setSquare(Piece.WhiteKing, File.E, Rank.r1)
      .setSquare(Piece.WhiteBishop, File.F, Rank.r1)
      .setSquare(Piece.WhiteKnight, File.G, Rank.r1)
      .setSquare(Piece.WhiteRook, File.H, Rank.r1)
      .setSquare(Piece.BlackRook, File.A, Rank.r8)
      .setSquare(Piece.BlackKnight, File.B, Rank.r8)
      .setSquare(Piece.BlackBishop, File.C, Rank.r8)
      .setSquare(Piece.BlackQueen, File.D, Rank.r8)
      .setSquare(Piece.BlackKing, File.E, Rank.r8)
      .setSquare(Piece.BlackBishop, File.F, Rank.r8)
      .setSquare(Piece.BlackKnight, File.G, Rank.r8)
      .setSquare(Piece.BlackRook, File.H, Rank.r8)

    for (let file = 0; file < 8; file++) {
      this
        .setSquare(Piece.WhitePawn, file, Rank.r2)
        .setSquare(Piece.BlackPawn, file, Rank.r7)
    }
    return this
  }
}

const chessBoard = reactive(new ChessBoard())
chessBoard
  .setStartBoard()
  .movePiece(File.E, Rank.r2, File.E, Rank.r4)
  .movePiece(File.E, Rank.r7, File.E, Rank.r5)
  .movePiece(File.G, Rank.r1, File.F, Rank.r3)
  .movePiece(File.B, Rank.r8, File.C, Rank.r6)
  .movePiece(File.D, Rank.r2, File.D, Rank.r4)
  .movePiece(File.E, Rank.r5, File.D, Rank.r4)
  .movePiece(File.F, Rank.r3, File.D, Rank.r4)

</script>

<template>
  <div>
    <div class="container-fluid">
      <div v-for="row, rank in chessBoard.squares" :id="`rank-${8 - rank}`" :key="rank" class="row g-0 board-rank">
        <div v-for="piece, file in row" :id="`square-${String.fromCharCode(65 + file) + (8-rank)}`" :key="file * 10 + rank" class="col board-square">
          <div v-if="piece != null" :class="piece" />
        </div>
      </div>
    </div>
    <h3>{{ chessBoard.turn }} to move</h3>
  </div>
</template>

<style>
.board-square {
  aspect-ratio: 1 / 1;
  background: #b58863;
}
.board-rank:nth-of-type(even) > .board-square:nth-of-type(even),
.board-rank:nth-of-type(odd) > .board-square:nth-of-type(odd) {
  background: #f0d9b5;
}

.bB {background-image:url(~/assets/pieces/bB.svg);}
.bK {background-image:url(~/assets/pieces/bK.svg);}
.bN {background-image:url(~/assets/pieces/bN.svg);}
.bP {background-image:url(~/assets/pieces/bP.svg);}
.bQ {background-image:url(~/assets/pieces/bQ.svg);}
.bR {background-image:url(~/assets/pieces/bR.svg);}
.wB {background-image:url(~/assets/pieces/wB.svg);}
.wK {background-image:url(~/assets/pieces/wK.svg);}
.wN {background-image:url(~/assets/pieces/wN.svg);}
.wP {background-image:url(~/assets/pieces/wP.svg);}
.wQ {background-image:url(~/assets/pieces/wQ.svg);}
.wR {background-image:url(~/assets/pieces/wR.svg);}

.board-square > div {
  height: 100%;
  width: auto;
  background-size: contain;
  background-position: center;
  /* background-size: 95%; */
  background-repeat: no-repeat;
}
</style>
