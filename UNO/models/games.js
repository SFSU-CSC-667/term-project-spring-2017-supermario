const db=require('../database/db');
const Models=require('./models');
const Players=require('./players');
const Users=require('./users');
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
			Games.findById(obj.game_id).then( game => {
				if (game.seat_count === MaxPlayer)
					throw "Error: The room is full";
					console.log(game);
					obj.seat_number=game.seat_count+1;
					db.one("insert into players(game_id, user_id, seat_number) values(${game_id}, ${user_id}, ${seat_number}) returning game_id, user_id", obj).then( pl => {
						game.seat_count++;
						if (game.seat_count === MaxPlayer)
							game.joinable=false;
						console.log(game);	
						db.none("update games set seat_count=${seat_count}, joinable=${joinable} where id=${id}",game).then(success => {
						fulfill(pl);
					});
				});
			}).catch( error => {
				console.log(error);
				reject(error);
			});
		});
	};
		
	static removePlayer(obj) {
		return new Promise(function(fulfill, reject){ 
			Games.findById(obj.game_id).then( game => {
				console.log(game);
				db.one("delete players where game_id = ${game_id} and user_id = ${user_id}) returning game_id, user_id", obj).then( pl => {
					game.seat_count--;
					if (game.seat_count < MaxPlayer)
						game.joinable=true;
					console.log(game);	
					db.none("update games set seat_count=${seat_count}, joinable=${joinable} where id=${id}",game).then(success => {
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
