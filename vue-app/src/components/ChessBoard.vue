<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Chess } from "../Chess"
import { IoClient } from "../IoClient"
import type { Color } from "chess.js";

const boardElement = ref<HTMLElement | null>(null)
let chess: Chess
let ioClient: IoClient

const inGame = ref<boolean>(false)
const createCode = ref<string>('')
const joinCode = ref<string>('')
const color = ref<Color | null>(null)

function createGame() {
  // TODO: username and color
  ioClient.newGame(createCode.value, 'user_w', 'w');
  color.value = 'w'
}

function joinGame() {
  // TODO: username and color
  ioClient.joinGame(joinCode.value, 'user_b')
  color.value = 'b'
}

// used by IoClient to sync with chessjs/chessground on new games
function startNewGame() {
  chess.startNewGame(color.value!)
}

onMounted(() => {
  if (!boardElement.value) {
    throw new Error("Board element not ready");
  }

  chess = new Chess(boardElement.value)

  // constructor connects to socket io server
  ioClient = new IoClient(
    startNewGame,
    (fen, moves) => chess.updateGameState(fen, moves)
  );

  chess.setClientMoveCallback((from, to, promotion) => ioClient.makeMove(from, to, promotion))
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

/* 
 * https://github.com/lichess-org/chessground/issues/134#issuecomment-748545779 
 * the board background with lichess default colors
 */
cg-board {
  /* TODO: make path not relative to current file */
  background-image: url('../assets/board-background.svg');
}
</style>