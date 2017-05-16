/* function add cards to package 'toPlayer' that will sent to client */

const initClient = (toPlayer, cards) => {
  console.log('init client from init-client.js')
  Object.assign(toPlayer, { cardsTable: cards})
}

module.exports = initClient
