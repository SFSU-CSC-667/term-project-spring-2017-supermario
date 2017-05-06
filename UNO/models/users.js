db=require('../database/db')
Models=require('./models')
class Users extends Models{
	
	static emailNotUsed(str){
		return db.none("select * from users where email like $1", str);
	}

	static findByEmail(str){
		return db.one("select * from users where email like $1", str);
	}

	static findByNickName(str){
		return db.one("select * from users where nick_name like $1", str); 
	}
	
	static createFromSignUp(obj){
		return db.none('insert into users(email, encrypted_password, nick_name) values(${email},${encrypted_password},${nick_name})',obj);
    }
}

module.exports=Users;
