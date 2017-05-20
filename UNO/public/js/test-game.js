
const socket = io();

var gameId = 1;
var userId = 3;
var cardId = 0;
var gameState = 0;
var cards = {};
var toServer = { word: {}, game_id: gameId, user_id: userId, game_state: gameState };
/*
var readyPlay, seat_count, seat_turn, top_discard, direction, players;  // shared information of the game
var timeOut, mySeat, myTurn, myCards, pickedCard;
var playable = { color: "", number: "" }  // color: 'r', 'b', 'g', or 'y'; number: 0~9, 13, or 14
var players={}, myInfo, whoStart, roundEnd, gameEnd;
var thisCard
*/
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
var chat=`{{#each messages}}
		<li>{{this.nick_name}}: {{this.message}}   {{this.post_time}}</li>
		{{/each}}`;

var chat_template=Handlebars.compile(chat);

$(function () {
  init()
  document.getElementById("gameNumber").innerHTML = gameId

  /* chat room needed to be solved chat channel */
 /*
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight)
  });
  */
  socket.on('game', function(msg) {
    if (msg.hasOwnProperty("user_id") && msg.user_id === userId) {
      userHandler(msg)
         console.log('\nfrom server: ', JSON.stringify(msg))
    } else if (msg.hasOwnProperty("group") && msg.group === gameId) {
      groupHandler(msg)
         console.log('\nfrom server: ', JSON.stringify(msg))
    }
  })



/*
  // Change the card image by click the option
  var select = '<option></option>'
  for (i=0; i<108; i++) {
    select += `<option value=${i}>${i}</option>`
  }
//  document.getElementById("selectCard").innerHTML = select
  
  var st = $('#selectCard')

  st.change(function() {
    cardId = $(this).val()
    document.getElementById('card').src='images/cards/' + cards[cardId].image_url;
  })
  */
})

function userHandler(msg) {
  var result = {};
  var order = msg.order;
  switch (order) {
    case 'none':
      result = 'none';
      break;
    case 'pickColor':
      result = 'pick a color';
      break;
    case 'redraw':
      result = 'redraw'
      showHandCards(msg.handCards)
      break
    case 'refresh':
      result = 'refresh';
      break;
    case 'init':
      result = 'init'
      cards = msg.cardsTable;
      //drawPlayers(msg)
      break;
    case 'exit':
      result = 'exit';
      break;
	case 'update_chat':
		result='update chat';
		html = chat_template(msg);
		document.getElementById('messages').innerHTML = html;
	    window.scrollTo(0, document.body.scrollHeight);
		break;
    default:
      result = 'no matched order';
  }
  // following for test use only
  gameState = msg.game_state
  console.log('client result: ', result)
  //  document.getElementById('userChannel').innerHTML = JSON.stringify(msg);
  if( cards !== {}) showHandCards(msg.handCards)
}

function groupHandler(msg) {
  if (msg.hasOwnProperty("winner")) {
      document.getElementById('board_text').innerHTML = "Winner is " + msg.winner;     
  }
  if (msg.order === 'update_chat') {
		html = chat_template(msg);
		document.getElementById('messages').innerHTML = html;
	    window.scrollTo(0, document.body.scrollHeight);
  }else{
  gameState = msg.game_state
  topDiscard(msg)
  drawArror(msg)
  drawPlayers(msg)
  if (msg.refresh === 'refresh') {
    // send refresh request to server
    post('refresh')
  }
  }
//  document.getElementById('groupChannel').innerHTML = JSON.stringify(msg);
}

/* respond to play action */
function post(word) {
//  pars play action
  toServer.game_state = gameState
  toServer.word = word
  sendOut(toServer);
}

function sendOut(outPackage) {
  socket.emit('game', outPackage);
}


function init() {
  gameId = $("#variables").data('game_id');
  userId = $("#variables").data('user_id');
  toServer = { word: {}, game_id: gameId, user_id: userId, game_state: gameState };
  post('init')
}


function showHandCards(handCards) {
  var cardsInhand = handCards
  var x = 0, image = '', oneCard = ''
  
  cardsInhand.forEach(element => {
    cardId = element.card_id
    oneCard = '/images/cards/' + cards[cardId].image_url
    image += `<img class="card" src="${oneCard}" ondragend="post(${cardId})"
                onclick="post(${cardId})" alt='card_id: ${cardId}'> `
    x += 15
  })
  document.getElementById('handCards').innerHTML = image
}

function topDiscard(msg) {
  if(cards[msg.game[0].top_discard]) {
    var discard = '/images/cards/' + cards[msg.game[0].top_discard].image_url 
  }else{
    var discard = '/images/cards/back.png';
  }
 // var image = `<img id="discardPile" src="${discard}" alt="top_discard">`
  document.getElementById('discard').src = discard
}

function drawArror(msg) {
  if (msg.game[0].direction === 1) {
    document.getElementById('dir_left').innerHTML = `<img id="left-arrow" src="/images/splash/leftup.png">`
    document.getElementById('dir_right').innerHTML = `<img id="left-arrow" src="/images/splash/rightdown.png">` 
  } else if (msg.game[0].direction === -1) {
    document.getElementById('dir_left').innerHTML = `<img id="left-arrow" src="/images/splash/leftdown.png">`
    document.getElementById('dir_right').innerHTML = `<img id="left-arrow" src="/images/splash/rightup.png">` 
  }
}


function drawPlayers(msg) {
   var userSeat=0;
   var playerNum=msg.players.length;
   msg.players.forEach( pl => {
        if(pl.id===userId){
			userSeat=pl.seat_number;
            if(msg.game[0].seat_turn===userSeat)
				document.getElementById('player_hint').innerHTML="Your Turn."
            else
				document.getElementById('player_hint').innerHTML="Wait for other players."
			
   			document.getElementById('opponent1_name').innerHTML=msg.players[(userSeat+1)%playerNum].nick_name
   			document.getElementById('opponent2_name').innerHTML=msg.players[(userSeat+2)%playerNum].nick_name
   			document.getElementById('opponent3_name').innerHTML=msg.players[(userSeat+3)%playerNum].nick_name
        } 
   });
   
}
