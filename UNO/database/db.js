
const pgp = require( 'pg-promise' )({
});

const db_conf = require('./conf');


connection = "postgres://" + db_conf.user+":" + db_conf.password + "@"+db_conf.host+":"+db_conf.port+"/"+db_conf.db;
console.log(connection)
db=pgp(connection);


module.exports=db
