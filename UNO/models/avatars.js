db=require('../database/db')
Models=require('./models')
class Avatars extends Models{
	

	static findById(id){
		return db.one("select * from avatars where id = $1", id);
	}
	static findAll(){
		return db.manyOrNone("select * from avatars order by id ASC ");
	}

}

module.exports=Avatars;
