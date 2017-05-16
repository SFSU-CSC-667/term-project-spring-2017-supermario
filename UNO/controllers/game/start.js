/* function starts the game when all players are ready */
const firstDealt = 7

const start = (msg, numOfCards, gameCards, gamePlayers, thisGame) => {
  console.log('starting game... under developing')
  var array = oneArray(numOfCards)
  // shuffle pile twice
  shuffle(array)
  shuffle(array)

  newPile(msg, array, gameCards)
  dealtCards(msg, gameCards, thisGame)
}

function oneArray(numOfCards) {
  var i, arr = []
  for (i = 0; i < numOfCards; i++) {
    arr.push(i)
  }
  return arr
}

function newPile(msg, array, gameCards) {
  var i
  if (gameCards.length === 0) {
    for (i = 0; i < array.length; i++) {
      gameCards.push({"game_id": msg.game_id, "card_id": array[i]
         , "user_id": null, "pile_order": i })
    }
  } else {
    for (i = 0; i < array.length; i++) {
      gameCards[i].game_id = msg.game_id
      gameCards[i].user_id = null
      gameCards[i].card_id = array[i]
      gameCards[i].pile_order = i
    }
  }
}

function dealtCards(msg, gameCards, gamePlayers, thisGame) {
  var i, j, k
  j = 0
  k = firstDealt * gamePlayers.length
  gamePlayers.array.forEach(function(element) {
    for (i = j; i < k; i += firstDealt) {
      gameCards[i].user_id = element.user_id
      gameCards[i].pile_order = null
    }
    j++
  })
  gameCards[k].pile_order = null
  thisGame.top_discard = gameCards[k].card_id
}

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
