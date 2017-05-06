/* Set up game environment */
const socket = io();
$(function () {
//  var socket = io();
  Handlebars.registerPartial("game-list", game_list);
  socket.on('create_game', function(msg) {
	//document.getElementById("chat").innerHTML = 'updated';
	//window.location.reload(true);
	/*Games.listJoinables().then( games=> {
		//location.reload(true);
		var data={games: games};
		//document.getElementById("game-list").innerHtml = (template(data));
		document.getElementById("chat").innerHtml = 'update games';
	}).catch( error => {
		games={};
	});
	*/
  });

  socket.on('update_games', function(msg) {
    var template = Handlebars.compile(game_list);
	document.getElementById("chat").innerHTML = 'updated';
	console.log(template(msg));
	document.getElementById("game-list").innerHTML = (template(msg));
  });	
});

function create_game(email) {
	console.log(email);
    msg = {email: email};
	socket.emit('create_game', msg);
};

var game_list=
			'{{#each games}}'
+			'<div id="game{{this.id}}" class="panel panel-default">'
+'				<div class="panel-heading">'
+'					<div class="row">'
+'						<div class="col-md-7">'
+'							<h4>Game {{this.id}}</h4>'
+'						</div>'
+'						<div class="col-md-4">'
+'							<h5># of players</h5>'
+'						</div>'
+'						<div class="col-md-1">'
+'							<a href="#" role="button" class="btn btn-success">Join Game</a>'
+'						</div>'
+'					</div>'
+'				</div>'
+'				<div class="panel-body">'
+'					<div class="row">'
+'						<div class="col-md-12">'
+'							<ul class="list-inline">'
+'<!--Code for each player in game-->'
+'							<li>playerid1</li>'
+'							<li>playerid2</li>'
+'							<li>playerid3</li>'
+'							<li>playerid4</li>'
+'							</ul>'
+'						</div> '
+'					</div>'
+'				</div>'
+'			</div>'
+'			{{/each}}';
