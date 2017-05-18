const access = require('../../models/game/access')
const update = require('../../models/game/update')

const DEALT_CARDS = 7

/* function starts the game when all players are ready */
const start = (msg) => {
  var numOfCards, array, topDiscard

  access.cards().then(result => {
    numOfCards = result.length
  })
  .then( () => {
    array = oneArray(numOfCards)

    shuffle(array)
    shuffle(array)
  
    return update.deleteOldGameCards(msg.game_id)
  })
  .then( () => {
    promises = [];
    array.forEach((el, index) => {
      promises.push(update.newGameCards(msg.game_id, el, null, index))
    });
    return Promise.all(promises)
  })
  .then( () => {
    dealtCards(msg)
  })
  .catch( e => {
    console.log(e)
  })
} // end of start

function oneArray(numOfCards) {
  var i, arr = []
  for (i = 0; i < numOfCards; i++) {
    arr.push(i)
  }
  return arr
}

function dealtCards(msg) {
  var game_players, game_cards, topOrder

  access.thisGamePlayers(msg.game_id)
  .then( data => {
    game_players = data
    topOrder = DEALT_CARDS * game_players.length

    var i, j = 0
    game_players.forEach( element => {
      for (i = 0; i < DEALT_CARDS; i++ ) {
        var userId = element.user_id
        var pileOrder = i+j
        update.dealtGameCards(userId, msg.game_id, pileOrder)
        .then( () => {
        })
        .catch( Error => {
          console.log(Error)
        })
      }
      j += DEALT_CARDS
    })
  })
  .then( () => {
    return access.getPileCardId(msg.game_id, topOrder)
  })
  .then( result => {
    return update.startGame(++topOrder, result.card_id, msg.game_id)
  })
  .then( result => {
    return update.dealtGameCards(null, msg.game_id, --topOrder)
  })
  .catch(Error => {
    console.log(Error)
  })

} // end of dealtCards

function shuffle(arr) {
  var i, j, k, temp
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr    
}  

module.exports = start
