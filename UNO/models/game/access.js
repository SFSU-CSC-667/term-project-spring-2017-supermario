const db = require('../../database/db')

const AVATARS = `SELECT * FROM Avatars`

const CARDS = `SELECT * FROM Cards ORDER BY id`

const CARD_IDS = `SELECT id FROM Cards`

const CARDS_IN_HAND = `SELECT card_id
                       FROM Game_Cards
                       WHERE game_id = $1
                       AND user_id = $2
                       ORDER BY card_id`

const CARDS_IN_PLAYERS = `SELECT user_id, COUNT(*) AS cardCount
                          FROM Game_Cards
                          GROUP BY user_id`                       

const GAME_CARDS = `SELECT * FROM Game_cards
                    WHERE game_id = $1` 

const PLAYERS_TO_GROUP = `SELECT GC.user_id, U.nick_name, U.user_score, P.score
                                , P.seat_number, P.announce_suit, A.image_url
                          FROM Players AS P, Users AS U, Game_Cards AS GC, Avatars AS A
                          WHERE U.id =  P.user_id
                          AND U.avatar_id = A.id
                          AND P.game_id = GC.game_id
                          AND GC.game_id = $1
                          ORDER BY P.seat_number`


const THISGAME_PLAYERS = `SELECT * FROM Players
                 WHERE game_id = $1
                 ORDER BY seat_number`

const THIS_PLAYER = `SELECT * FROM Players
                     WHERE game_id = $1
                     AND user_id = $2`

const THIS_GAME = `SELECT * FROM Games
                   WHERE id = $1`



module.exports = {
  // for server init
  avatars: () => db.any(AVATARS),
  cards: () => db.any(CARDS),
  cardIds: () => db.any(CARD_IDS),

  gameCards: (game_id) => db.any(GAME_CARDS, [game_id]),
  thisGamePlayers: (game_id) => db.any(THISGAME_PLAYERS, [game_id]),
  thisPlayer: (game_id, user_id) => db.any(THIS_PLAYER, [game_id, user_id]),
  thisGame: (game_id) => db.any(THIS_GAME, [game_id]),

  // for send to client(s)
  cardsInHand: (game_id, user_id) => db.any(CARDS_IN_HAND, [game_id, user_id]),
  playersToGroup: (game_id) => db.any(PLAYERS_TO_GROUP, [game_id]),
  cardsInPlayers: (game_id) => db.any(CARDS_IN_PLAYERS, [game_id])
}