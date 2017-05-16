/* function mark the player ready state and return if all players are ready */

const ready = (msg, gamePlayers) => {
  var allReady =  true
  var players = 0
  if (gamePlayers.length === 0)
    return false
  gamePlayers.array.forEach(function(element) {
    players++
                             console.log('element', element) // debug use only
    if (element.user_id === msg.user_id) {
      element.ready_play =  true
    }

    allReady = (element.ready_play && allReady) ?  true : false  
  })
  
  return allReady && players > 1
}

module.exports = ready
