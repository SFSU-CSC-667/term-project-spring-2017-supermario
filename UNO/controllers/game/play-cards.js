const access = require('../../models/game/access')
const update = require('../../models/game/update')

var cards   // local global for local functions
access.cards().then(result => {
  cards = result
})
.catch( Error => {
  console.log(Error)
})

/*
 * deal with the card played by a player
 * msg: { word:<action>, game_state:integer, game_id:integer, user_id:integer }
 */
const playCards = msg => {
  var thisGame, thisGameCards, thisGamePlayers, promises

  promises = [ access.thisGame(msg.game_id)
              , access.gameCards(msg.game_id)
              , access.thisGamePlayers(msg.game_id) ]
  Promise.all(promises).then(values => {
    thisGame = values[0]
    thisGameCards = values[1]
    thisGamePlayers = values[2]

    if (validPlay(msg, thisGame, thisGamePlayers)) {
      promises = dealCard(msg, thisGame, thisGameCards, thisGamePlayers)
    } else {
      console.log('not valid play')
    }
    return promises
  })
  .then(value => {
    Promise.all(value).then(values => {
      console.log('promises return from dealCard(..) ', value)
      console.log('update database finished')
    })
  })
  .catch( Error => {
    console.log(Error)
  })

  console.log('playCards is developing')
} // end of playCards

function validPlay(msg, thisGame, thisGamePlayers) {
  var inTurn = colorMatch = numberMatch = validState = false
console.log('server game state ', thisGame[0].game_state, ' client ', msg.game_state)
  // check if in valid state
  validState = (msg.game_state === thisGame[0].game_state) ? true : false

  // check if in turn
  thisGamePlayers.forEach(element => {
    if (msg.user_id === element.user_id &&
          element.seat_number === thisGame[0].seat_turn) {
      inTurn = true
    }
  })

console.log('top discard ', thisGame[0].top_discard, ' msg word ', msg.word )
  // check if wild cards
  if (msg.word > 99) return true

  // check color
  var cardColor
  if (cards[thisGame[0].top_discard].color === cards[msg.word].color)
      colorMatch = true

  // check number
  if (cards[thisGame[0].top_discard].number_symbol === cards[msg.word].number_symbol)      
    numberMatch = true

/* comment out following line for test
  return inTurn && validState && (colorMatch || colorMatch)
*/
  return true // for test, pretend true
} // end of validState

function dealCard(msg, thisGame, thisGameCards, thisGamePlayers) {
  var promises = []
  var thisCard = cards[msg.word].number_symbol

  // number card
    console.log('this card should less than 10 :', thisCard)
  if( thisCard < 10 ) {
      promises.push(update.addPileOrder(msg.game_id, thisGame[0].next_order))                     
      promises.push(update.playNumberCard(msg.game_id, msg.word))
      // following not set seat_turn + 1 for testing thd same player
      // game state not thisGame.game_state + 1
      promises.push(update.updateGame(++thisGame[0].seat_turn, thisGame[0].direction
                     , ++thisGame[0].next_order, msg.word, ++thisGame[0].game_state))
  }                         

  // action card
  // wild card
  // wild four card
    
  

  // need to return a promise at the end
//    return Promise.all(gamePromise)
  return promises
} // end of dealCard

module.exports = playCards