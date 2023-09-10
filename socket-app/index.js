import { Server } from 'socket.io'

const io = new Server(3001, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

io.on('connection', (socket) => {
  console.log('a user has connected')

  // TODO: verify moves before emitting
  socket.on('chess-move', (move) => {
    console.log(`${move.color} has made the move ${move.moveNumber}.${move.move}`)

    io.emit('chess-move', move)
  })
})
