/* Set up game environment */
const socket = io();
$(function () {

  var template=Handlebars.compile(gamelist);
  
  socket.on('lobby server', function(msg) {
	//document.getElementById("chat").innerHTML = 'updated';
	console.log(document.getElementById("gamelist").innerHTML);
	//console.log(document.getElementById("chat"));
	var html = "updated";
	html = template(msg);
	document.getElementById("gamelist").innerHTML = html;
	console.log(document.getElementById("gamelist").innerHTML);
	//document.getElementById("gamelist").innerHTML = "updated";
	//console.log(msg);
	//document.getElementById("chat").innerHTML = (template(msg));
    
	//console.log(document);
  });	
});

function create_game(email) {
	console.log(email);
    msg = {email: email, action: "create_game"};
	socket.emit('lobby server', msg);
};

function join_game(email,game_id) {
	console.log(email);
    msg = {email: email, action: "join_game",game_id: game_id};
	socket.emit('lobby server', msg);
}

var gamelist =	`{{#each games}}
			<div id="game{{this.id}}" class="panel panel-default">
				<div class="panel-heading">
					<div class="row">
						<div class="col-md-5">
							<h4>Game {{this.id}}</h4>
						</div>
						<div class="col-md-4">
							<h5># of players</h5>
						</div>
						<div class="col-md-3">
							<a href="#" role="button" class="btn btn-danger pull-right", onclick="join_game('{{email}}','game{{this.id}}')">Join Game</a>
						</div>
					</div>
				</div>
				<div class="panel-body">
					<div class="row">
						<div class="col-md-12">
							<ul class="list-inline">
							<!--Code for each player in game-->
							<li>{{this.playerid1}}</li>
							<li>{{this.playerid2}}</li>
							<li>{{this.playerid3}}</li>
							<li>{{this.playerid4}}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			{{/each}}`;
/*
var game_list=
			'{{#each games}}'
+			'<div id="game{{this.id}}" class="panel panel-default">'
+'				<div class="panel-heading">'
+'					<div class="row">'
+'						<div class="col-md-5">'
+'							<h4>Game {{this.id}}</h4>'
+'						</div>'
+'						<div class="col-md-4">'
+'							<h5># of players</h5>'
+'						</div>'
+'						<div class="col-md-3">'
+'							<a href="#" role="button" class="btn btn-danger pull-right">Join Game</a>'
+'						</div>'
+'					</div>'
+'				</div>'
+'				<div class="panel-body">'
+'					<div class="row">'
+'						<div class="col-md-12">'
+'							<ul class="list-inline">'
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
*/
