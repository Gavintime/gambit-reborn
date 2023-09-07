<script setup lang="ts">
import { Chess } from 'chess.js'

const chess = new Chess()
const chessBoardState = ref(chess.board())

let srcSquare: string | null = null
function squareClick (event: Event) {
  const square = (event.target as HTMLElement).parentElement!.id

  // first click
  if (srcSquare === null) {
    srcSquare = square
    return
  }

  try {
    chess.move({ from: srcSquare, to: square })
  } catch (_) {
    alert('ILLEGAL MOVE! ')
  }

  srcSquare = null
  chessBoardState.value = chess.board()
}
</script>

<template>
  <div>
    <div class="container-fluid">
      <div v-for="row, rank in chessBoardState" :key="rank" class="row g-0 board-rank">
        <div
          v-for="piece, file in row"
          :id="String.fromCharCode(97 + file) + (8 - rank)"
          :key="String.fromCharCode(97 + file) + (8 - rank)"
          class="col board-square"
        >
          <div v-if="piece" :class="piece.color + piece.type" @click="squareClick" />
          <div v-else @click="squareClick" />
        </div>
      </div>
    </div>
    <h3>{{ chess.turn() === 'w' ? 'White' : 'Black' }} to move</h3>
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

.bb {background-image:url(~/assets/pieces/bB.svg);}
.bk {background-image:url(~/assets/pieces/bK.svg);}
.bn {background-image:url(~/assets/pieces/bN.svg);}
.bp {background-image:url(~/assets/pieces/bP.svg);}
.bq {background-image:url(~/assets/pieces/bQ.svg);}
.br {background-image:url(~/assets/pieces/bR.svg);}
.wb {background-image:url(~/assets/pieces/wB.svg);}
.wk {background-image:url(~/assets/pieces/wK.svg);}
.wn {background-image:url(~/assets/pieces/wN.svg);}
.wp {background-image:url(~/assets/pieces/wP.svg);}
.wq {background-image:url(~/assets/pieces/wQ.svg);}
.wr {background-image:url(~/assets/pieces/wR.svg);}

.board-square > div {
  height: 100%;
  width: auto;
  background-size: contain;
  background-position: center;
  /* background-size: 95%; */
  background-repeat: no-repeat;
}
</style>
