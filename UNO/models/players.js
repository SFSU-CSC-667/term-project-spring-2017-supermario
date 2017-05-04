db=require('../database/db')
Models=require('./models')

class Players extends Models {

	static create(obj) {
		return db.one("insert into players(game_id, user_id, seat_number) values(${game_id}, ${user_id}, ${seat_number}) returning game_id, user_id", obj);
	}

	static findById(id) {
		return db.one("select * from players where id = $1", id);
	}
		
	static listJoinables() {
		return db.many("select * from games where joinable = true");
	}
}

module.exports=Players;
