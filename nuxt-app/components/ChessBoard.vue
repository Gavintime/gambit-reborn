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

type Square = {
  piece: Piece | null
  rank: Rank
  file: File
}

type BoardRank = {
  squares: Square[]
  rank: Rank
}

class ChessBoard {
  ranks: BoardRank[]
  turn: 'WHITE' | 'BLACK' = 'WHITE'
  whiteCastle = true
  blackCastle = true
  enPassantSquare: Square | null = null

  constructor () {
    this.ranks = []

    // create ranks and squares
    for (let i = 0; i < 8; i++) {
      this.ranks[i] = {
        squares: [],
        rank: i
      }

      for (let j = 0; j < 8; j++) {
        this.ranks[i].squares[j] = {
          piece: null,
          rank: i,
          file: j
        }
      }
    }
  }

  private setSquare (piece: Piece | null, rank: Rank, file: File): this {
    this.ranks[rank].squares[file].piece = piece
    return this
  }

  setStartBoard (): this {
    this.turn = 'WHITE'
    this.whiteCastle = true
    this.blackCastle = true
    this.enPassantSquare = null
    this
      .setSquare(Piece.WhiteRook, Rank.r1, File.A)
      .setSquare(Piece.WhiteKnight, Rank.r1, File.B)
      .setSquare(Piece.WhiteBishop, Rank.r1, File.C)
      .setSquare(Piece.WhiteQueen, Rank.r1, File.D)
      .setSquare(Piece.WhiteKing, Rank.r1, File.E)
      .setSquare(Piece.WhiteBishop, Rank.r1, File.F)
      .setSquare(Piece.WhiteKnight, Rank.r1, File.G)
      .setSquare(Piece.WhiteRook, Rank.r1, File.H)

      .setSquare(Piece.BlackRook, Rank.r8, File.A)
      .setSquare(Piece.BlackKnight, Rank.r8, File.B)
      .setSquare(Piece.BlackBishop, Rank.r8, File.C)
      .setSquare(Piece.BlackQueen, Rank.r8, File.D)
      .setSquare(Piece.BlackKing, Rank.r8, File.E)
      .setSquare(Piece.BlackBishop, Rank.r8, File.F)
      .setSquare(Piece.BlackKnight, Rank.r8, File.G)
      .setSquare(Piece.BlackRook, Rank.r8, File.H)

    for (let file = 0; file < 8; file++) {
      this
        .setSquare(Piece.WhitePawn, Rank.r2, file)
        .setSquare(Piece.BlackPawn, Rank.r7, file)
    }
    return this
  }
}

const chessBoard = reactive(new ChessBoard())
chessBoard.setStartBoard()

</script>

<template>
  <div>
    <div class="container-fluid">
      <div v-for="{squares, rank} in chessBoard.ranks" :key="rank" class="row g-0 board-rank">
        <div v-for="{piece, rank: squareRank , file} in squares" :key="file * 10 + squareRank" class="col board-square">
          <div v-if="piece != null" :class="piece" />
        </div>
      </div>
    </div>
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
