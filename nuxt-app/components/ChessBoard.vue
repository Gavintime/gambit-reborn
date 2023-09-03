<script setup lang="ts">

// Ranks are indexed in reverse order so they render correctly in v-for loops
enum RankName {
  r1 = 7,
  r2 = 6,
  r3 = 5,
  r4 = 4,
  r5 = 3,
  r6 = 2,
  r7 = 1,
  r8 = 0
}

enum FileName {
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
  coord: {
    rankName: RankName,
    fileName: FileName
  }
}

type Rank = {
  squares: Square[]
  rankName: RankName
}

class ChessBoard {
  ranks: Rank[]
  turn: 'WHITE' | 'BLACK' = 'WHITE'
  whiteCastle = true
  blackCastle = true

  constructor () {
    this.ranks = []

    // create ranks and squares
    for (let i = 0; i < 8; i++) {
      this.ranks[i] = {
        squares: [],
        rankName: i
      }

      for (let j = 0; j < 8; j++) {
        this.ranks[i].squares[j] = {
          piece: null,
          coord: {
            rankName: i,
            fileName: j
          }
        }
      }
    }
  }

  setSquare (piece: Piece | null, rank: RankName, file: FileName): this {
    this.ranks[rank].squares[file].piece = piece
    return this
  }

  setStartBoard (): this {
    this.turn = 'WHITE'
    this.whiteCastle = true
    this.blackCastle = true
    this
      .setSquare(Piece.WhiteRook, RankName.r1, FileName.A)
      .setSquare(Piece.WhiteKnight, RankName.r1, FileName.B)
      .setSquare(Piece.WhiteBishop, RankName.r1, FileName.C)
      .setSquare(Piece.WhiteQueen, RankName.r1, FileName.D)
      .setSquare(Piece.WhiteKing, RankName.r1, FileName.E)
      .setSquare(Piece.WhiteBishop, RankName.r1, FileName.F)
      .setSquare(Piece.WhiteKnight, RankName.r1, FileName.G)
      .setSquare(Piece.WhiteRook, RankName.r1, FileName.H)

      .setSquare(Piece.BlackRook, RankName.r8, FileName.A)
      .setSquare(Piece.BlackKnight, RankName.r8, FileName.B)
      .setSquare(Piece.BlackBishop, RankName.r8, FileName.C)
      .setSquare(Piece.BlackQueen, RankName.r8, FileName.D)
      .setSquare(Piece.BlackKing, RankName.r8, FileName.E)
      .setSquare(Piece.BlackBishop, RankName.r8, FileName.F)
      .setSquare(Piece.BlackKnight, RankName.r8, FileName.G)
      .setSquare(Piece.BlackRook, RankName.r8, FileName.H)

    for (let file = 0; file < 8; file++) {
      this
        .setSquare(Piece.WhitePawn, RankName.r2, file)
        .setSquare(Piece.BlackPawn, RankName.r7, file)
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
      <div v-for="{squares, rankName} in chessBoard.ranks" :key="rankName" class="row g-0 board-rank">
        <div v-for="{piece, coord} in squares" :key="coord.fileName * 10 + coord.rankName" class="col board-square">
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
