const access = require('../../models/game/access.js')
const update = require('../../models/game/update.js')
const ready = require('./ready')
const start = require('./start')
const initClient = require('./init-client')

/*
 * Content of object from client:
 * msg: { word:<action>, game_state:integer, game_id:integer, user_id:integer }
 * Content of objects send to client:
 * toPlayer: { order:string, user_id:integer, game_state:integer, handCards:array }
 * toGroup: { group:<game_id>, game_state:integer, players:array, game:array }
 */
const TO_PLAYER = { order:{}, user_id:{}, game_state:{}, handCards:{} }
const TO_GROUP = { group:{}, refresh:{}, game_state:{}, players:{}, game:{}, cardsInPlayers:{} }
var thisGame, thisPlayer, gamePlayers, gameCards, toPlayer, toGroup
var cards, avatars // should read only after they are assigned
var cardPiles = {}  // object format: { ${game_id}: [card_id1, card_id2, ...], ...}
var numOfCards

init()

function init() {
  access.cards()
  .then( data => {
    cards = data
    numOfCards = cards.length
    return access.cardIds()
  })
  .catch ( e => {
    console.log( 'read cards table error', e)
  })
}

const eventHandler = (msg, callback) => {
  toPlayer = Object.assign({}, TO_PLAYER)
  toGroup = Object.assign({}, TO_GROUP)

  // read tables of this game from database
  access.thisGame(msg.game_id).then( data => {
    thisGame = data
    console.log(thisGame)
    return access.thisPlayer(msg.game_id, msg.user_id);
  })
  .then( data => {
    thisPlayer = data;
    console.log('this player ', thisPlayer);
    return access.gameCards(msg.game_id)
  })
  .then( data => {
    gameCards = data
    return access.thisGamePlayers(msg.game_id)
  })
  .then( data => {
    gamePlayers = data
console.log('gamePlayers: ', gamePlayers)
    
    handleEvent(msg)
  })

  // update tables according to changes here


  // read data from the updated tables and assemble send out packages
  .then( data => {
    return access.cardsInHand(msg.game_id, msg.user_id)
  })
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
    packOutPackage(msg)
    callback(toPlayer, toGroup)
  })
  .catch( e => {
    console.log('error from eventHandler', e)
  })

} // end of eventHandler


function handleEvent(msg) {
  const word = msg.word
  console.log(word)
  if (typeof word === 'number') {
    result = 'get number'
  }
  switch (word) {
    case 'draw':
      asDraw()
      result = 'get draw'
      break
    case 'refresh':
      asDraw()
      result = 'get refresh'
      break
    case 'skip':
      asSkip()
      result = 'get skip'
      break
    case 'ready':
      result = ready(msg, gamePlayers)
      if (result) {
        start(msg, numOfCards, gameCards, gamePlayers, thisGame)
      }
      break
    case 'red':
    case 'green':
    case 'blue':
    case 'yellow':
      asPickedColor(word)
      result = 'get ' + word
      break
    case 'uno':
      asUno()
      result = 'get uno'
      break
    case 'init':
      result = 'get init'
      initClient(toPlayer, cards)
      break
    case 'exit':
      result = 'get exit'
      asExit()
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

function packOutPackage(msg) {
  toPlayer.user_id = msg.user_id
  toPlayer.order = wordMapOrder(msg.word)
  toPlayer.refresh = wordMapOrder(msg.word)
  toGroup.group = msg.game_id
  if (toGroup.game.length > 0) {
    toGroup.game_state = toGroup.game[0].game_state
    toPlayer.game_state = toGroup.game[0].game_state
  }
}


function asDraw() {
  console.log('do Draw under develop')
}

function asSkip() {
  console.log('do Skip under develop')
}

function asReady() {
  console.log('do Read under develop')
  console.log('this game within asReady()', thisGame)
}

function asPickedColor(word) {
  console.log('picked color under develop')
}

function asUno() {
  console.log('do Uno under develop')
}

function asExit() {
  console.log('do Exit under develop')
}

function isValidAction() {
  return (msg.game_state === thisGame.game_state)
}

function isInTurn() {
  return (thisGame.seat_turn === thisPlayer.seat_number)
}


module.exports = eventHandler