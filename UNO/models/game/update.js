const db = require('../../database/db')

const SET_READY = `UPDATE Players
                   SET ready_play = $1
                   WHERE game_id = $2
                   AND user_id = $3`

const NEW_GAME_CARDS =  `INSERT INTO Game_Cards
                          (game_id, card_id, user_id, pile_order)
                        VALUES
                          ($1,$2,$3,$4)`

const DELETE_OLD_GAME_CARDS = `DELETE FROM Game_Cards
                               WHERE game_id = $1`

const DEALT_GAME_CARDS = `UPDATE Game_Cards
                          SET user_id = $1, pile_order = null
                          WHERE game_id = $2
                          AND pile_order = $3`

const SET_PILE_ORDER_NULL = `UPDATE Game_Cards
                             SET pile_order = null
                             WHERE game_id = $1
                             AND pile_order = $2`

const START_GAME = `UPDATE Games
                     SET next_order = $1,
                         top_discard = $2,
                         joinable = false
                     WHERE id = $3`                                                                                      

module.exports = {
  dealtGameCards: (user_id, game_id, pile_order) => db.none(DEALT_GAME_CARDS, [user_id, game_id, pile_order]),

  deleteOldGameCards: (game_id) => db.none(DELETE_OLD_GAME_CARDS, game_id),

  newGameCards: (game_id, card_id, user_id, pile_order) => db.none(NEW_GAME_CARDS, [game_id, card_id, user_id, pile_order]),

  setPileOrderNull: (game_id, pile_order) => db.none(SET_PILE_ORDER_NULL, [game_id, pile_order]),

  setReady: (ready, game_id, user_id) => db.none(SET_READY, [ready, game_id, user_id]),

  startGame: (next_order, top_discard, id) => db.none(START_GAME, [next_order, top_discard, id])
}
