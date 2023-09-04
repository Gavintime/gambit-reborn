<script setup lang="ts">

// Ranks are indexed in reverse order so they render correctly in v-for loops
enum Rank {
  R1 = 7,
  R2 = 6,
  R3 = 5,
  R4 = 4,
  R5 = 3,
  R6 = 2,
  R7 = 1,
  R8 = 0
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

type Coord = {
  file: File
  rank: Rank
}

class ChessBoard {
  // 8x8
  squares: (Piece | null)[][]
  turn: 'WHITE' | 'BLACK' = 'WHITE'
  whiteCastle = true
  blackCastle = true
  enPassantSquare: Coord | null = null

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

  // does not do move validation or understand castling/enpassant
  makeMove (start: Coord, end: Coord): this {
    const tempPiece = this.squares[start.rank][start.file]
    this.squares[start.rank][start.file] = null
    this.squares[end.rank][end.file] = tempPiece

    this.turn = this.turn === 'WHITE' ? 'BLACK' : 'WHITE'

    return this
  }

  setStartBoard (): this {
    this.turn = 'WHITE'
    this.whiteCastle = true
    this.blackCastle = true
    this.enPassantSquare = null

    this.squares[Rank.R1][File.A] = Piece.WhiteRook
    this.squares[Rank.R1][File.B] = Piece.WhiteKnight
    this.squares[Rank.R1][File.C] = Piece.WhiteBishop
    this.squares[Rank.R1][File.D] = Piece.WhiteQueen
    this.squares[Rank.R1][File.E] = Piece.WhiteKing
    this.squares[Rank.R1][File.F] = Piece.WhiteBishop
    this.squares[Rank.R1][File.G] = Piece.WhiteKnight
    this.squares[Rank.R1][File.H] = Piece.WhiteRook

    this.squares[Rank.R8][File.A] = Piece.BlackRook
    this.squares[Rank.R8][File.B] = Piece.BlackKnight
    this.squares[Rank.R8][File.C] = Piece.BlackBishop
    this.squares[Rank.R8][File.D] = Piece.BlackQueen
    this.squares[Rank.R8][File.E] = Piece.BlackKing
    this.squares[Rank.R8][File.F] = Piece.BlackBishop
    this.squares[Rank.R8][File.G] = Piece.BlackKnight
    this.squares[Rank.R8][File.H] = Piece.BlackRook

    for (let file = 0; file < 8; file++) {
      this.squares[Rank.R2][file] = Piece.WhitePawn
      this.squares[Rank.R7][file] = Piece.BlackPawn
      // clear ranks 3 to 6
      for (let rank = 2; rank < 6; rank++) {
        this.squares[rank][file] = null
      }
    }
    return this
  }
}

const chessBoard = reactive(new ChessBoard())

function getCoordFromID (id: string): Coord {
  return {
    file: parseInt(id.charAt(7)),
    rank: 7 - parseInt(id.charAt(8))
  }
}

let srcCoord: Coord | null = null
function squareClick (event: Event) {
  // console.log((event.target as HTMLElement).parentElement?.id)
  const id = (event.target as HTMLElement).parentElement?.id

  const coord = getCoordFromID(id!)

  // first click
  if (srcCoord === null) {
    srcCoord = {
      file: coord.file,
      rank: coord.rank
    }
    return
  }

  chessBoard.makeMove(srcCoord, coord)
  srcCoord = null
}

// TODO: lifecycle hook to set board to start/fen BEFORE board is rendered at all
onMounted(() => {
  chessBoard.setStartBoard()
})

</script>

<template>
  <div>
    <div class="container-fluid">
      <div v-for="row, rank in chessBoard.squares" :key="rank" class="row g-0 board-rank">
        <div v-for="piece, file in row" :id="`square-${file.toString() + (7-rank)}`" :key="file * 10 + rank" class="col board-square">
          <div :class="piece" @click="squareClick" />
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
