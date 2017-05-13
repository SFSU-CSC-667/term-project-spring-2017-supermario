db=require('../database/db')
Models=require('./models')
Games=require('./games')
MaxPlayer = 4;

class Players extends Models {

	static create(obj) {
		return db.one("insert into players(game_id, user_id, seat_number) values(${game_id}, ${user_id}, ${seat_number}) returning game_id, user_id", obj);
	}

	static createEmptySeats(game_id, seat_number) {
		return db.none("insert into players(game_id, user_id, seat_number) values($1, 0, $1)", game_id, seat_number);
	}


	static addPlayer(obj) {
			console.log(obj);
			Games.findById(obj.game_id).then( game => {
				game.seat_count+=1;
				console.log(game);
				
				db.none("update games set seat_count=${seat_count} where id=${id}",game).then(success => {
					console.log(game);
					obj.seat_number=game.seat_count;
					return db.one("insert into players(game_id, user_id, seat_number) values(${game_id}, ${user_id}, ${seat_number}) returning game_id, user_id", obj);
				});
			}).catch( error => {
				console.log(error);
			});
	}

	static findById(id) {
		return db.one("select * from players where id = $1", id);
	}

	static findByGameId(game_id) {
		return db.many("select * from players where game_id = $1 order by seat_number ASC", game_id);
	}

	static findByGameSeat(game_id,seat_number) {
		return db.one("select * from players where game_id = $1 and seat_number = $2", game_id, seat_number);
	}

	static findEmptySeat(game_id){
		return db.one("select * from players where game_id = $1 and user_id=0 order by seat_number ASC", game_id);
	}
}

module.exports=Players;
