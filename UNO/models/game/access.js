const db = require('../../database/db')

const AVATARS = `SELECT * FROM Avatars`

const CARDS = `SELECT * FROM Cards ORDER BY id`

const CARD_IDS = `SELECT id FROM Cards`

const CARDS_IN_HAND = `SELECT card_id
                       FROM Game_Cards
                       WHERE game_id = $1
                       AND user_id = $2
                       ORDER BY card_id`

const CARDS_IN_PLAYERS = `SELECT user_id, COUNT(user_id) AS cardCount
                          FROM Game_Cards
                          WHERE game_id = $1
                          AND user_id IS NOT NULL
                          GROUP BY user_id`                       

const GET_PILE_CARDID = `SELECT card_id
                         FROM Game_Cards
                         WHERE game_id = $1
                         AND pile_order = $2`                          

const GAME_CARDS = `SELECT * FROM Game_Cards
                    WHERE game_id = $1` 

const PLAYERS_THIS_GROUP = `SELECT U.id, U.nick_name, U.user_score, P.score
                                , P.seat_number, P.announce_suit, A.image_url
                          FROM Players AS P, Users AS U, Games AS G, Avatars AS A
                          WHERE U.id =  P.user_id
                          AND U.avatar_id = A.id
                          AND P.game_id = G.id
                          AND G.id = $1
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

  gameCards: (game_id) => db.any(GAME_CARDS, game_id),
  getPileCardId: (game_id, pile_order) => db.oneOrNone(GET_PILE_CARDID, [game_id, pile_order]),
  thisGamePlayers: (game_id) => db.any(THISGAME_PLAYERS, game_id),
  thisPlayer: (game_id, user_id) => db.any(THIS_PLAYER, [game_id, user_id]),
  thisGame: (game_id) => db.any(THIS_GAME, game_id),

  // for send to client(s)
  cardsInHand: (game_id, user_id) => db.any(CARDS_IN_HAND, [game_id, user_id]),
  playersThisGroup: (game_id) => db.any(PLAYERS_THIS_GROUP, game_id),
  cardsInPlayers: (game_id) => db.any(CARDS_IN_PLAYERS, game_id)
}
