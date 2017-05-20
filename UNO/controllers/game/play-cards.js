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
  return Promise.all(promises).then(values => {
    thisGame = values[0]
    thisGameCards = values[1]
    thisGamePlayers = values[2]

    if (validPlay(msg, thisGame, thisGamePlayers)) {
      promises = dealCard(msg, thisGame, thisGameCards, thisGamePlayers)
    } else {
      promises = []
      console.log('not valid play')
    }
    return Promise.all(promises)
  })
  // .then(value => {
  //    console.log('returned promises from value',value)
  //  Promise.all(value).then(values => {
  //     console.log('promises return from dealCard(..) ', value)
  //     console.log('update database finished')
  //   })
  // })
  .catch( Error => {
    console.log(Error)
  })
} // end of playCards

function validPlay(msg, thisGame, thisGamePlayers) {
  var inTurn = colorMatch = numberMatch = validState = anyCard = false


  // check if the top discard is action card
  if (cards[thisGame[0].top_discard].number_symbol > 9 ) anyCard = true
console.log('topdiscard ',cards[thisGame[0].top_discard].number_symbol)
  // check if in valid state
  validState = (msg.game_state === thisGame[0].game_state) ? true : false

  // check if in turn
  var player=0;
  thisGamePlayers.forEach(element => {
	player++;
    if (msg.user_id === element.user_id &&
          element.seat_number === thisGame[0].seat_turn) {
      inTurn = true
    }
  })
  if (msg.word === 'draw') return inTurn;
  // check if wild cards
  if (msg.word > 99) return inTurn;

  // check color
  var cardColor
  if (cards[thisGame[0].top_discard].color === cards[msg.word].color)
      colorMatch = true

  // check number
  if (cards[thisGame[0].top_discard].number_symbol === cards[msg.word].number_symbol)      
    numberMatch = true

    console.log('inturn: ',inTurn, ' valid state: ', validState, ' color: ',colorMatch, ' number: ',numberMatch, ' anyCard: ',anyCard)

    console.log(' valid play? ', inTurn && validState && (colorMatch || numberMatch))

  //return anyCard || (validState && (colorMatch || numberMatch)) // test only

  return (anyCard && inTurn) || (inTurn && validState && (colorMatch || numberMatch))
} // end of validState

function dealCard(msg, thisGame, thisGameCards, thisGamePlayers) {
  var promises = []
  var thisCard //= (typeof msg.word === 'number') ? cards[msg.word].number_symbol : msg.word
  var newSeatTurn

  thisCard = (typeof msg.word === 'number') ? cards[msg.word].number_symbol : msg.word

   if ( thisCard === 10 ) {
    // skip card
    promises.push(update.addPileOrder(msg.game_id, thisGame[0].next_order))                     
    promises.push(update.playNumberCard(msg.game_id, msg.word))
    getNewSeatTurn(thisGame, 2).then( newSeatTurn => {
    promises.push(update.updateGame(newSeatTurn, thisGame[0].direction
                     , thisGame[0].next_order, msg.word, ++thisGame[0].game_state, msg.game_id))
    });
  } else if ( thisCard === 11 ) {
    // reverse card
    promises.push(update.addPileOrder(msg.game_id, thisGame[0].next_order))                     
    promises.push(update.playNumberCard(msg.game_id, msg.word))
    var newDirection = -1 * thisGame[0].direction
    newSeatTurn = getNewSeatTurn(thisGame, -1)
    promises.push(update.updateGame(newSeatTurn, newDirection
                     , thisGame[0].next_order, msg.word, ++thisGame[0].game_state, msg.game_id))
 } else if ( msg.word === 'draw') {
   // draw a card
   newSeatTurn = getNewSeatTurn(thisGame, 1)
   promises.push(update.dealtGameCards(msg.user_id, msg.game_id, thisGame[0].next_order))
   promises.push(update.updateGame(newSeatTurn, thisGame[0].direction
                     , ++thisGame[0].next_order, thisGame[0].top_discard, ++thisGame[0].game_state, msg.game_id))
 
 } else {  // if( thisCard < 10 ) {
    // number card
    promises.push(update.addPileOrder(msg.game_id, thisGame[0].next_order))                     
    promises.push(update.playNumberCard(msg.game_id, msg.word))
    // following not set seat_turn + 1 for testing thd same player
    // game state not thisGame.game_state + 1
    newSeatTurn = getNewSeatTurn(thisGame, 1)
    promises.push(update.updateGame(newSeatTurn, thisGame[0].direction
                     , ++thisGame[0].next_order, msg.word, ++thisGame[0].game_state, msg.game_id))

  }
  /*
   else if ( thisCard === 12 ) {
    // draw 2 card
    // let go temparary

  } else if ( thisCard === 13 ) {
    // wild card
    // let go temparary


  } else if ( thisCard === 14 ) {
    // wild draw 4 card
    // let go temparary

  }
  */

  return promises
} // end of dealCard

function getNewSeatTurn(thisGame, step) {
  return new Promise( function(fulfill, reject){
 	 fulfill( (thisGame[0].seat_turn + step*thisGame[0].direction) % thisGame[0].seat_count);
  });
}

module.exports = playCards
