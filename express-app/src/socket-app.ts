import { Server } from 'socket.io'
import { Chess } from 'chess.js'

const io = new Server({
  cors: {
    // nuxt app address
    origin: 'http://localhost:3000'
  }
})

// stores a chess game, as well as players for each game
const gameInstances: any = {}

io.on('connection', (socket) => {
  console.log('a user has connected')

  socket.on('new-game', (newGameData, callback) => {
    if (newGameData.code in gameInstances) {
      callback(false)
      return
    }

    gameInstances[newGameData.code] = {
      chess: new Chess(),
      whiteUserName: newGameData.color === 'w' ? newGameData.userName : null,
      blackUserName: newGameData.color === 'b' ? newGameData.userName : null
    }

    callback(true)
    console.log(`${newGameData.userName} has created a new game as ${newGameData.color}`)
    socket.join(newGameData.code)
  })

  socket.on('join-game', (joinGameData, callback) => {
    if (!(joinGameData.code in gameInstances)) {
      callback(false)
      console.log(`${joinGameData.userName} attempted to join the non existant game ${joinGameData.code}`)
      return
    }

    const game = gameInstances[joinGameData.code]

    // user is already in this game
    if (game.whiteUserName === joinGameData.userName ||
        game.blackUserName === joinGameData.userName) {
      callback(false)
    }

    if (game.whiteUserName === null) {
      game.whiteUserName = joinGameData.userName
    } else if (game.blackUserName === null) {
      game.blackUserName = joinGameData.userName
    } else {
      callback(false)
      console.log(`${joinGameData.userName} attempted to join the full game game ${joinGameData.code}`)
    }

    // TODO: send notification to player 1 that a second player has joined
    callback(true)
    socket.join(joinGameData.code)
  })

  socket.on('make-move', (moveData, callback) => {

    // invalid game code
    if (!(moveData.code in gameInstances)) {
      callback(false)
      console.log('user tried making a move for a non existant game')
      return
    }

    const game = gameInstances[moveData.code]

    // does not belong to this game
    if (![game.whiteUserName, game.blackUserName].includes(moveData.userName)) {
      callback(false)
      console.log('user tried making a move for a game they dont belong to')
      return
    }

    // not the users turn
    if ((game.chess.turn() === 'w' && game.whiteUserName !== moveData.userName) ||
        (game.chess.turn() === 'b' && game.blackUserName !== moveData.userName)) {
      callback(false)
      console.log(`${moveData.userName} tried sending a move when it's not their turn, or they are not apart of this game`)
      return
    }

    try {
      game.chess.move(moveData.move)
    } catch (_) {
      console.log(`${moveData.userName} attempted to make the illegal move ${moveData.moveNumber}.${moveData.move}`)
      callback(false)
      return
    }

    console.log(`${moveData.userName} has made the move ${moveData.moveNumber}.${moveData.move} in ${moveData.code}`)
    // tell client their move was accepted
    callback(true)
    // emit to everyone in same room except sender
    socket.broadcast.to(moveData.code).emit('server-move', moveData)
  })
})

// console.log('Socket IO Server Initialized')
export default io