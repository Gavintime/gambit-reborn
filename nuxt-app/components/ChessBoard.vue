<script setup>
const chessBoard = reactive(
  [
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
  ]
)
</script>

<template>
  <div>
    <div class="container-fluid">
      <div v-for="rank in chessBoard" class="row g-0 board-rank">
        <div v-for="square in rank" class="col board-square">
          <div v-if="square" :class="square" />
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
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
}

</style>
