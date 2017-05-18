const access = require('../../models/game/access.js')
const update = require('../../models/game/update.js')
const ready = require('./ready')
const start = require('./start')
const initClient = require('./init-client')
const draw = require('./draw')
const pass = require('./pass')
const pickedColor = require('./picked-color')
const uno = require('./uno')
const userExit = require('./user-exit')
const playCards = require('./play-cards')
const refreshClient = require('./refreshClient')

/*
 * Content of object from client:
 * msg: { word:<action>, game_state:integer, game_id:integer, user_id:integer }
 * Content of objects send to client:
 * toPlayer: { order:string, user_id:integer, game_state:integer, handCards:array }
 * toGroup: { group:<game_id>, refresh:string game_state:integer, players:array, game:array }
 */
const TO_PLAYER = { order:{}, user_id:{}, game_state:{}, handCards:{} }
const TO_GROUP = { group:{}, refresh:{}, game_state:{}, players:{}, game:{}, cardsInPlayers:{} }

const eventHandler = (msg, callback) => {
  var toPlayer = Object.assign({}, TO_PLAYER)
  var toGroup = Object.assign({}, TO_GROUP)

  toPlayer.user_id = msg.user_id
  toGroup.group = msg.game_id
  handleEvent(msg, toPlayer, toGroup)

  // read data from the updated tables and assemble send out packages
  access.cardsInHand(msg.game_id, msg.user_id)
  .then( data => {
    toPlayer.handCards = data
    return access.thisGame(msg.game_id)
  })
  .then( data => {
    toGroup.game = data
    return access.playersToGroup(msg.game_id)
  })
  .then( data => {
    toGroup.players = data
    return access.cardsInPlayers(msg.game_id)
  })
  .then( data => {
    toGroup.cardsInPlayers = data
  })
  .then( data => {
    packOutPackage(msg, toPlayer, toGroup)
    callback(toPlayer, toGroup)
  })
  .catch( e => {
    console.log('error from eventHandler', e)
  })

} // end of eventHandler


function handleEvent(msg, toPlayer, toGroup) {
  const word = msg.word
  console.log(word)
  if (typeof word === 'number') {
    playCards(msg)
    result = 'get number'
  }
  switch (word) {
    case 'draw':
      draw(msg)
      result = 'get draw'
      break
    case 'refresh':
      refreshClient(msg)
      result = 'auto refresh'
      break
    case 'pass':
      pass(msg)
      result = 'get pass'
      break
    case 'ready':
      result = ready(msg)  // if ready, then start game
                      start(msg) // for test with out players are really ready
      if (result) {
        start(msg)
      } else {
        result = 'not ready to start'
      }
      break
    case 'red':
    case 'green':
    case 'blue':
    case 'yellow':
      pickedColor(msg)
      result = 'get ' + word
      break
    case 'uno':
      uno(msg)
      result = 'get uno'
      break
    case 'init':
      result = 'get init'
      initClient(toPlayer)
      break
    case 'exit':
      result = 'get exit'
      exit(msg)
      break
    default:
      result = 'no matched word'
  }
  console.log('result: ', result)
}

const wordMapOrder = word => {
  switch (word) {
    case 'draw':
      result = 'settle'
      break
    case 'ready':
      result = 'refresh'
      break;
    case 'init':
      result = 'init'
      break;
    case 'exit':
      result = 'exit'
      break
    default:
      result = 'none'
  }
  return result
}

function setRefreshFlag(word) {
  var result
  switch (word) {
    case 'ready':
    case 23:
    case 24:
    case 48:
    case 49:
    case 73:
    case 74:
    case 98:
    case 99:
    case 104:
    case 105:
    case 106:
    case 107:
      result = 'refresh'
      break
    default:
      result = {}
  }
  return result
}

function packOutPackage(msg, toPlayer, toGroup) {
  toPlayer.user_id = msg.user_id
  toPlayer.order = wordMapOrder(msg.word)
  toGroup.refresh = setRefreshFlag(msg.word)
  toGroup.group = msg.game_id
  if (toGroup.game.length > 0) {
    toGroup.game_state = toGroup.game[0].game_state
    toPlayer.game_state = toGroup.game[0].game_state
  }
}

function isValidAction() {
  return (msg.game_state === thisGame.game_state)
}

function isInTurn() {
  return (thisGame.seat_turn === thisPlayer.seat_number)
}


module.exports = eventHandler