const db=require('../database/db');
const Models=require('./models');
const Players=require('./players');
const Users=require('./Users');
const MaxPlayer=4;
class Games extends Models {

	static create(){
		return db.one("insert into games(seat_count,joinable) values(1,true) returning id, joinable");
	};

	static findById(id){
		return db.one("select * from games where id = $1", id);
	};

	static addPlayer(obj) {
		return new Promise(function(fulfill, reject){ 
			console.log(Games);
			console.log(Users);
			Games.findById(obj.game_id).then( game => {
				game.seat_count+=1;
				if (game.seat_count > MaxPlayer)
					throw "Error: The room is full";
				console.log(game);	
				db.none("update games set seat_count=${seat_count} where id=${id}",game).then(success => {
					console.log(game);
					obj.seat_number=game.seat_count;
					db.one("insert into players(game_id, user_id, seat_number) values(${game_id}, ${user_id}, ${seat_number}) returning game_id, user_id", obj).then( pl => {
						fulfill(pl);
					});
				});
			}).catch( error => {
				console.log(error);
				reject(error);
			});
		});
	};
		
	static listJoinables(){

		return new Promise(function(fulfill, reject){
			db.many("select * from games where joinable = true order by id ASC limit 20").then( games => {
				var iterGame=0;
				games.forEach(game => {
					Players.findByGameId(game.id).then( pls => {
						var names=[];
						pls.forEach(pl => {
							Users.findById(pl.user_id).then( user => {
								names.push(user.nick_name);
								if (names.length === pls.length){
									game.players=names;
									iterGame++;
									if (iterGame === games.length) {
										fulfill(games);
									}
								}
							});
						});
					});
				});
			}).catch( error => {
				reject(error);
			});
		});
	}

}

module.exports=Games;
