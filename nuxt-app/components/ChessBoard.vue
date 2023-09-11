<script setup lang="ts">
import { Chess, Square } from 'chess.js'
import { io } from 'socket.io-client'

const chess = new Chess()
const chessBoardState = ref(chess.board())

const socket = io('ws://localhost:3001')

const lastClientMoveMade = { color: 'b', moveNumber: 0 }

const inGame = ref(false)
const userName = ref()

socket.on('server-move', (move) => {
  // Received the opponents move
  if (chess.turn() === move.color && chess.moveNumber() === move.moveNumber) {
    // TODO: try catch this in case server sends illegal move/desync
    chess.move(move.move)
    chessBoardState.value = chess.board()
  // server verified our move
  // TODO: verify actual moves are the same
  } else if (lastClientMoveMade.color === move.color && lastClientMoveMade.moveNumber === move.moveNumber) {
    console.log('WARNING: SERVER SENT OUR OWN MOVE BACK TO US')
  } else {
    console.log('WARNING: RECEIEVED MOVE FROM THE PAST/FUTURE!!!')
    console.log(`CLIENT MOVE: ${chess.turn()} ${chess.moveNumber()}`)
    console.log(`SERVER MOVE: ${move.color} ${move.moveNumber}`)
  }
})

const gameCode = ref()

function createGame () {
  userName.value = 'user_w'

  socket.emit('new-game',
    {
      code: gameCode.value,
      // TODO: get from user
      color: 'w',
      userName: 'user_w'
    },
    (accepted: boolean) => {
      if (!accepted) {
        alert('COULD NOT CREATE GAME')
        return
      }
      chess.reset()
      chessBoardState.value = chess.board()
      inGame.value = true
    }
  )
}

function joinGame () {
  userName.value = 'user_b'

  socket.emit('join-game',
    {
      code: gameCode.value,
      // TODO: get from user
      color: 'b',
      userName: 'user_b'
    },
    (accepted: boolean) => {
      if (!accepted) {
        alert('COULD NOT JOIN GAME')
        return
      }
      chess.reset()
      chessBoardState.value = chess.board()
      inGame.value = true
    }
  )
}

const srcSquare: Ref<Square | null> = ref(null)
function squareClick (event: Event) {
  const square = (event.target as HTMLElement).parentElement!.id as Square

  // first click
  if (srcSquare.value === null) {
    if (chess.get(square) && chess.get(square).color === chess.turn()) {
      // TODO: server game side checks
      srcSquare.value = square
    }
    return
  }

  let promotionPiece: string | undefined
  if (chess.get(srcSquare.value).type === 'p') {
    if ((chess.turn() === 'w' && square[1] === '8') ||
        (chess.turn() === 'b' && square[1] === '1')) {
      // TODO: replace with a clickable ui element
      const piece = prompt('Please enter the piece type you would like to promote to:\nInvalid entries default to queen\nq r b n', 'q')
      if (piece !== null && ['q', 'r', 'b', 'n'].includes(piece)) {
        promotionPiece = piece
      } else {
        promotionPiece = 'q'
      }
    }
  }

  lastClientMoveMade.color = chess.turn()
  lastClientMoveMade.moveNumber = chess.moveNumber()
  try {
    chess.move({ from: srcSquare.value, to: square, promotion: promotionPiece })
  } catch (_) {
    srcSquare.value = null
    alert('ILLEGAL MOVE! ')
    return
  }

  // send chess move to web socket server
  if (inGame.value) {
    socket.emit('make-move',
      {
        color: lastClientMoveMade.color,
        moveNumber: lastClientMoveMade.moveNumber,
        move: srcSquare + square,
        code: gameCode.value,
        userName: userName.value
      },
      (accepted: boolean) => {
        if (!accepted) {
          chess.undo()
          // this needs to happen here since our emit runs asynchronously
          chessBoardState.value = chess.board()
          alert('SERVER REJECTED MOVE')
        }
      }
    )
  }

  srcSquare.value = null
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
          :class="{ selected: (String.fromCharCode(97 + file) + (8 - rank)) === srcSquare }"
        >
          <div v-if="piece" :class="piece.color + piece.type" @click="squareClick" />
          <div v-else @click="squareClick" />
        </div>
      </div>
    </div>
    <div v-if="inGame">
      <h3>{{ chess.turn() === 'w' ? 'White' : 'Black' }} to move</h3>
    </div>
    <div v-else class="container">
      <div class="input-group mb-3">
        <input v-model="gameCode" class="form-control" type="text" placeholder="Invite Code">
        <button class="btn btn-outline-secondary" type="button" @click="createGame">
          Create New Game
        </button>
      </div>
      <div class="input-group mb-3">
        <input v-model="gameCode" class="form-control" type="text" placeholder="Invite Code">
        <button class="btn btn-outline-secondary" type="button" @click="joinGame">
          Join Game
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.board-square {
  aspect-ratio: 1 / 1;
  background: #b58863;
}

.board-rank:nth-of-type(even)>.board-square:nth-of-type(even),
.board-rank:nth-of-type(odd)>.board-square:nth-of-type(odd) {
  background: #f0d9b5;
}

.board-square.selected,
.board-rank:nth-of-type(even)>.board-square:nth-of-type(even).selected,
.board-rank:nth-of-type(odd)>.board-square:nth-of-type(odd).selected {
  background: rgb(137, 202, 94);
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

.board-square>div {
  height: 100%;
  width: auto;
  background-size: contain;
  background-position: center;
  /* background-size: 95%; */
  background-repeat: no-repeat;
}
</style>
