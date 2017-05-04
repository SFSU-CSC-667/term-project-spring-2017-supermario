/* Set up game environment */
const socket = io();

const myId = { game_id: 5, user_id: 10 };
const GAMESERVER = 'game';

var readyPlay, seat_count, seat_turn, top_discard, direction, players;  // shared information of the game
var timeOut, mySeat, myTurn, myCards, pickedCard;
var playable = { color: "", number: "" }  // color: 'r', 'b', 'g', or 'y'; number: 0~9, 13, or 14
var cardImages, playersInfo, playersState, myInfo, whoStart, roundEnd, gameEnd;

// request server for card image file names, player infos

/* Listening from server * /
socket.on('game', function(msg) {
  document.getElementById('feedback').innerHTML = msg;
});*/
/* Update */
/* Draw Scene * /
/* Check if in turn */
/* Listening player event */
/* Check timeout */
/* Event response */
// *

//*/


$(function () {
//  var socket = io();
  post('cardImages');
  post('playersInfo');
  post('myInfo');
  /* chat room need to solve chat channel */
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    if(msg === '9999') msg = 'it is string 9999';
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  socket.on('game', function(msg) {
    document.getElementById('feedback').innerHTML = msg;
  });

});

function post(e) {
  document.getElementById("tosend").innerHTML = "You are going to send:" + e;
  sendOut(e);
}

function sendOut(msg) {
  socket.emit(GAMESERVER, Object.assign({"word": msg}, myId));
}