const db=require('../database/db');
const Games=require('./games');
const Users=require('./users');
const Models=require('./models');

class Players extends Models {

	static create(obj) {
		return db.one("insert into players(game_id, user_id, seat_number) values(${game_id}, ${user_id}, ${seat_number}) returning game_id, user_id", obj);
	};



	static findByGameId(game_id) {
		return db.many("select * from players where game_id = $1 order by seat_number ASC", game_id);
	};

	static findByGameSeat(game_id,seat_number) {
		return db.one("select * from players where game_id = $1 and seat_number = $2", game_id, seat_number);
	};
}

module.exports=Players;
