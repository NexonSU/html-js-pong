var rightpoints = -1;
var leftpoints = -1;
var countdown = -1;
var countdown_div = document.querySelector("body > .multiplayer-tdm > .wrap > .countdown");
var last_local_paddle_position = 49;
var local_paddle_position = 50;
var username = document.querySelector("body > .options input[name=\"username\"]").value;
var dot_div = document.querySelector("body > .multiplayer-tdm .dot");
var gamedata = {};
var wrap_div = document.querySelector('body > .multiplayer-tdm > .wrap');
var sound_lastupdate = Math.floor(Date.now() / 1000);
var sending_loop = 0;
var local_id = 'unknown';
var dot_x = 0;
var dot_y = 0;
var dot_x_prev = 0;
var dot_y_prev = 0;

document.querySelectorAll('body > .multiplayer-tdm > .wrap > .leftpaddle, body > .multiplayer-tdm > .wrap > .rightpaddle').forEach(paddle => {
	paddle.remove();
});

function connect() {
	for (s in sockets) sockets[s].close();

	var ws = new WebSocket("wss://pong-websocket.nexon.su/");

	sockets.push(ws);

	ws.onmessage = function (event) {
		gamedata = JSON.parse(event.data);
		if(dot_x_prev > dot_x && gamedata.d.x > dot_x)sound_paddle.play();
		if(dot_x_prev < dot_x && gamedata.d.x < dot_x)sound_paddle.play();
		if(dot_y_prev > dot_y && gamedata.d.y > dot_y)sound_wall.play();
		if(dot_y_prev < dot_y && gamedata.d.y < dot_y)sound_wall.play();
		dot_div.style.top = gamedata.d.y + "%";
		dot_div.style.left = gamedata.d.x + "%";
		dot_y_prev = dot_y;
		dot_y = gamedata.d.y;
		dot_x_prev = dot_x;
		dot_x = gamedata.d.x;
		if(gamedata.cd != countdown){
			countdown = gamedata.cd;
			countdown_div.innerHTML = countdown;
			if(countdown == 3)sound_score.play();
			if(countdown == 0)countdown_div.style.opacity = 0; else countdown_div.style.opacity = 1;
			if(countdown == 404)countdown_div.innerHTML = "WAITING FOR PLAYERS";
		}
		if(gamedata.lp != leftpoints){
			leftpoints = gamedata.lp;
			document.querySelector("body > .multiplayer-tdm > .wrap > .leftpoints").innerHTML = leftpoints;
		}
		if(gamedata.rp != rightpoints){
			rightpoints = gamedata.rp;
			document.querySelector("body > .multiplayer-tdm > .wrap > .rightpoints").innerHTML = rightpoints;
		}
		for (id in gamedata.pals) {
			if (gamedata.pals[id].u == username)local_id = id;
			player_paddle = document.querySelector('body > .multiplayer-tdm > .wrap > .'+CSS.escape(id));
			if(gamedata.pals[id].p == -100){
				if(player_paddle  !== null)player_paddle.remove();
			} else {
				if(player_paddle  !== null){
					if(local_id != id)player_paddle.style.top = gamedata.pals[id].p + "%";
				} else {
					player_paddle = document.createElement("div");
					player_paddle.className = "leftpaddle " + id;
					player_paddle.innerHTML = "<p>"+gamedata.pals[id].u+"</p>";
					wrap_div.appendChild(player_paddle);
				}
			}
		}
		for (id in gamedata.pars) {
			if (gamedata.pars[id].u == username)local_id = id;
			player_paddle = document.querySelector('body > .multiplayer-tdm > .wrap > .'+CSS.escape(id));
			if(gamedata.pars[id].p == -100){
				if(player_paddle  !== null)player_paddle.remove();
			} else {
				if(player_paddle  !== null){
					if(local_id != id)player_paddle.style.top = gamedata.pars[id].p + "%";
				} else {
					player_paddle = document.createElement("div");
					player_paddle.className = "rightpaddle " + id;
					player_paddle.innerHTML = "<p>"+gamedata.pars[id].u+"</p>";
					wrap_div.appendChild(player_paddle);
				}
			}
		}
	};

	ws.onopen = function (event) {
		verbose_update = 0;
		sending_loop = setInterval(function() {
			if(ws.readyState == WebSocket.OPEN){
				position = Math.floor(local_paddle_position);
				if(verbose_update){
					ws.send(JSON.stringify({'p': position}));
				} else {
					ws.send(JSON.stringify({'u': username, 'p': position}));
				}
				verbose_update++;
				if(verbose_update == 128)verbose_update = 0;
			}
		}, 16);
	};

	ws.onclose = function(e) {
		window.clearInterval(sending_loop);
		ws.close();
		change_layer('menu');
	};

	ws.onerror = function(err) {
		window.clearInterval(sending_loop);
		console.error('Socket encountered error: ', err.message, 'Closing socket');
		ws.close();
		change_layer('menu');
	};
}

document.querySelector("body > .multiplayer-tdm .input").addEventListener('mousemove', e => {
	local_paddle_position = e.offsetY / (window.innerHeight / 100);
	position = local_paddle_position - 10;
	if(position < 0)position = 0;
	if(position > 80)position = 80;
	local_paddle = document.querySelector('body > .multiplayer-tdm > .wrap > .'+CSS.escape(local_id));
	if(local_paddle !== null)local_paddle.style.top = position + "%";
});

document.querySelector("body > .multiplayer-tdm .input").addEventListener("touchmove", function(e){ 
	e.preventDefault();
	local_paddle_position = e.touches[0].clientY / (window.innerHeight / 100);
	position = local_paddle_position - 10;
	if(position < 0)position = 0;
	if(position > 80)position = 80;
	local_paddle = document.querySelector('body > .multiplayer-tdm > .wrap > .'+CSS.escape(local_id));
	if(local_paddle !== null)local_paddle.style.top = position + "%";
}, {passive: false});

connect();