db=require('../database/db')
Models=require('./models')

class Games extends Models {

	static create(){
		return db.one("insert into games(seat_count,joinable) values(1,true) returning id, joinable");
	}

	static update(obj){
		return db.none("update games values(${seat_count},${seat_turn},), where id=${id}",obj);
	}

	static findById(id){
		return db.one("select * from games where id = $1", id);
	}
		
	static listJoinables(){
		return db.many("select * from games where joinable = true limit 20 order by id ASC");
	}
}

module.exports=Games;
