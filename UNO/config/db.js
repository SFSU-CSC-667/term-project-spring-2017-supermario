
var express = require( 'express' );
var router=express.Router();
const passport = require('../authentication/passport')
const pgp = require( 'pg-promise' )({
});

const db_params = {
    host: 'localhost',
	port: 5432,
	db: 'UNO',
	user: '',
	password: '',
}


connection = "postgres://" + db_params.user+":" + db_params.password + "@"+db_params.host+":"+db_params.port+"/"+db_params.db;
console.log(connection)
db=pgp(connection);


module.exports=db
