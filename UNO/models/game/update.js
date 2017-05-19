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

const UPDATE_GAME = `UPDATE Games
                     SET seat_turn = $1,
                         direction = $2,
                         next_order = $3,
                         top_discard = $4,
                         game_state = $5
                     WHERE id = $6`

const PLAY_NUMBER_CARD = `UPDATE Game_Cards
                            SET user_id = null
                            WHERE game_id = $1
                            AND card_id = $2`

const ADD_PILE_ORDER = `UPDATE Game_Cards
                        SET pile_order = null
                        WHERE game_id = $1
                        AND pile_order = $2`                           

const UPDATE_PLAYERS = `UPDATE Players
                        SET say_uno = $1,
                            announce_suit = $2,
                            score = $3
                        WHERE game_id = $4
                        AND user_id = $5`                                                                                                                                                          

module.exports = {
  addPileOrder: (game_id, pile_order) => db.none(ADD_PILE_ORDER, [game_id, pile_order]),

  dealtGameCards: (user_id, game_id, pile_order) => db.none(DEALT_GAME_CARDS
                , [user_id, game_id, pile_order]),

  deleteOldGameCards: (game_id) => db.none(DELETE_OLD_GAME_CARDS, game_id),

  newGameCards: (game_id, card_id, user_id, pile_order) => db.none(NEW_GAME_CARDS
              , [game_id, card_id, user_id, pile_order]),

  setPileOrderNull: (game_id, pile_order) => db.none(SET_PILE_ORDER_NULL, [game_id, pile_order]),

  setReady: (ready, game_id, user_id) => db.none(SET_READY, [ready, game_id, user_id]),

  startGame: (next_order, top_discard, id) => db.none(START_GAME, [next_order, top_discard, id]),

  updateGame: (seat_turn, direction, next_order, top_discard, game_state, id) => db.none(UPDATE_GAME
            , [seat_turn, direction, next_order, top_discard, game_state, id]),

  playNumberCard: (game_id, card_id) => db.none(PLAY_NUMBER_CARD, [game_id, card_id]),

  updatePlayers: (say_uno, announce_suit, score, game_id, user_id) => db.none(UPDATE_PLAYERS
               , [say_uno, announce_suit, score, game_id, user_id])                                    
}
