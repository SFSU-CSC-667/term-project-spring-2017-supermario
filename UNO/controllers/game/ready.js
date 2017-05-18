const update = require('../../models/game/update')
const access = require('../../models/game/access')
/* set the player ready to play and check if all players are ready */

const ready = (msg) => {
  var allReady =  true
  var players = 0

  update.setReady(true, msg.game_id, msg.user_id)
  .then( r => {
    console.log('set ready ok', r)
    return access.thisGamePlayers(msg.game_id)
  })
  .then(result => {
    result.forEach(element => {
      players++
      if (element.ready_play === false) {
        allReady = false
      }
    })
  })
  .catch(e => {
    console.log(e)
  })
  
  return allReady && players > 1
}

module.exports = ready
