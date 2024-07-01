<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Chess } from "../Chess"
import { IoClient } from "../IoClient"

const boardElement = ref<HTMLElement | null>(null)
let chess: Chess
let ioClient: IoClient

const inGame = ref<boolean>(false)
const createCode = ref<string>('')
const joinCode = ref<string>('')

function createGame() {
  console.log(createCode.value)
  ioClient.newGame(createCode.value, 'user_w', 'w');
}

function joinGame() {

}

onMounted(() => {
  if (!boardElement.value) {
    // TODO: site is broken if we get here
    return;
  }

  // constructor connects us to socket io server
  ioClient = new IoClient();

  chess = new Chess(boardElement.value, (lastMove) => {
    ioClient.makeMove(lastMove);
  })
})
</script>

<template>
  <div class="chessground" ref="boardElement"></div>

  <template v-if="inGame">
    <!-- <h3>{{ chess.turn() === 'w' ? 'White' : 'Black' }} to move</h3> -->
  </template>

  <!-- TODO: force 6 digits -->
  <template v-else>
    <input v-model="createCode" type="text" placeholder="Invite Code">
    <button type="button" @click="createGame">
      Create New Game
    </button>
    <input v-model="joinCode" type="text" placeholder="Invite Code">
    <button type="button" @click="joinGame">
      Join Game
    </button>
  </template>
</template>

<style>
@import "../../node_modules/chessground/assets/chessground.base.css";
@import "../../node_modules/chessground/assets/chessground.brown.css";
@import "../../node_modules/chessground/assets/chessground.cburnett.css";

.chessground {
  aspect-ratio: 1/1;
}

/* TODO: move this to a real svg file*/
/* 
 * https://github.com/lichess-org/chessground/issues/134#issuecomment-748545779 
 * the board background with lichess default colors
 */
cg-board {
  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4PSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogICAgIHZpZXdCb3g9IjAgMCA4IDgiIHNoYXBlLXJlbmRlcmluZz0iY3Jpc3BFZGdlcyI+CjxnIGlkPSJhIj4KICA8ZyBpZD0iYiI+CiAgICA8ZyBpZD0iYyI+CiAgICAgIDxnIGlkPSJkIj4KICAgICAgICA8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZjBkOWI1IiBpZD0iZSIvPgogICAgICAgIDx1c2UgeD0iMSIgeT0iMSIgaHJlZj0iI2UiIHg6aHJlZj0iI2UiLz4KICAgICAgICA8cmVjdCB5PSIxIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjYjU4ODYzIiBpZD0iZiIvPgogICAgICAgIDx1c2UgeD0iMSIgeT0iLTEiIGhyZWY9IiNmIiB4OmhyZWY9IiNmIi8+CiAgICAgIDwvZz4KICAgICAgPHVzZSB4PSIyIiBocmVmPSIjZCIgeDpocmVmPSIjZCIvPgogICAgPC9nPgogICAgPHVzZSB4PSI0IiBocmVmPSIjYyIgeDpocmVmPSIjYyIvPgogIDwvZz4KICA8dXNlIHk9IjIiIGhyZWY9IiNiIiB4OmhyZWY9IiNiIi8+CjwvZz4KPHVzZSB5PSI0IiBocmVmPSIjYSIgeDpocmVmPSIjYSIvPgo8L3N2Zz4K');
}
</style>