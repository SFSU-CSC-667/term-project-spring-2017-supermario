const access = require('../../models/game/access')

/* add cards to package 'toPlayer' that will sent to client */

const initClient = (toPlayer) => {

  access.cards().then(result => {
    cards = result
    Object.assign(toPlayer, { cardsTable: cards })
  })
  .catch( e => {
    console.log(e)
  })

}

module.exports = initClient
