const update = require('../../models/game/update')
const access = require('../../models/game/access')
/* set the player ready to play and check if all players are ready */

const ready = (msg) => {
return new Promise( function(fulfill, reject){

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
	    console.log(element.user_id + "IS NOT READY");
        allReady = false;
      }
	  if(players === result.length){
		console.log( allReady && players === 4);
  	  	fulfill(allReady && players === 4)
	  }
    })
  })
  .catch(e => {
    console.log(e)
	reject(e)
  })
  }); 
}

module.exports = ready
