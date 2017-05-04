db=require('../database/db')
Models=require('./models')

class Games extends Models {

	static create(){
		return db.one("insert into games(joinable) values(true) returning id, joinable");
	}

	static findById(id){
		return db.one("select * from games where id = $1", id);
	}
		
	static listJoinables(){
		return db.many("select * from games where joinable = true");
	}
}

module.exports=Games;
