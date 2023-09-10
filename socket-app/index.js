import { Server } from 'socket.io'
import { Chess } from 'chess.js'

const io = new Server(3001, {
  cors: {
    // nuxt app address
    origin: 'http://localhost:3000'
  }
})

const chessInstance = new Chess()

io.on('connection', (socket) => {
  console.log('a user has connected')

  socket.on('chess-move', (moveData, callback) => {

    try {
      chessInstance.move(moveData.move)
    } catch (_) {
      console.log(`${moveData.color} attempted to make the illegal move ${moveData.moveNumber}.${moveData.move}`)
      callback(false)
      return
    }

    console.log(`${moveData.color} has made the move ${moveData.moveNumber}.${moveData.move}`)
    // tell client their move was accepted
    callback(true)
    // emit to everyone except sender
    socket.broadcast.emit('chess-move', moveData)
  })
})

console.log('Socket IO Server Initialized')
