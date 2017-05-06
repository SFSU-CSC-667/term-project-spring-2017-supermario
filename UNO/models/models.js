
db=require('../database/db')
class Models {
	
	static checkField(field){
		return db.one("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME like 'users' and column_name like $1", field);
	}

	static One(field,str){
		Users.checkField(field).then( res => {
			return db.one("select * from users where "+field+" like $1",  str);
		}).catch( error => {
			console.log(error)
		});
	}
}

module.exports=Models;
