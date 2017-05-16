db=require('../database/db');
Models=require('./models');
Users=require('./users');
class Messages extends Models{
	
	static listByGameId(id){
		return new Promise(function(fulfill, reject){
				db.manyOrNone("select * from messages where game_id = $1 order by id ASC limit 50", id).then( msgs => {
						var iterMsg=0;
						msgs.forEach(msg => {
							Users.findById(msg.user_id).then( user => {
								msg.nick_name=user.nick_name;
								iterMsg++;
								if (iterMsg === msgs.length) {
									fulfill(msgs);
								}
							});
						});
				}).catch(error => {
					reject(error);
				});
		});
	}
	
	static listLobbyMsg(){
		return Messages.listByGameId(0);
	}

	static findByEmail(str){
		return db.one("select * from users where email like $1", str);
	}

	static findByNickName(str){
		return db.one("select * from users where nick_name like $1", str); 
	}
	
	static create(obj){
		return db.none('insert into messages(game_id, user_id,  message) values(${game_id},${user_id},${message})',obj);
    }
}

module.exports=Messages;
