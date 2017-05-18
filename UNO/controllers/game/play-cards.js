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
  var thisGame, thisGameCards, thisGamePlayers

  access.thisGame(msg.game_id)
  .then( data => {
    thisGame = data
    return access.gameCards(msg.game_id)
  })
  .then( data => {
    thisGameCards = data
    return access.thisGamePlayers(msg.game_id)
  })
  .then( data => {
    thisGamePlayers = data
    if (validPlay(msg, thisGame, thisGamePlayers)) {
      dealCard(msg, thisGame, thisGameCards, thisGamePlayers)
    }
  })
  .catch( Error => {
    console.log(Error)
  })


  console.log('playCards need to develop')
} // end of playCards

function validPlay(msg, thisGame, thisGamePlayers) {
  var valid = false

  // check if in valid state
  if (msg.game_state !== thisGame.game_state) return false

  // check if in turn
  thisGamePlayers.forEach(element => {
    if (msg.user_id === element.user_id &&
          element.seat_number === thisGame.seat_turn) {
      valid = true
    }
  })

  // check if color

  return  valid
} // end of validState

function dealCard(msg, thisGame, thisGameCards, thisGamePlayers) {
  console.log('dealCard function is under developing')
} // end of dealCard

module.exports = playCards