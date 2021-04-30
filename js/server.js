const WebSocket = require('ws');
const ws = new WebSocket.Server({
	port: 5678,
	perMessageDeflate: false
});

var dot = {'x': 50.0, 'y': 50.0};
var countdown = 404;
var leftpoints = 0;
var rightpoints = 0;
var dot_angle = 45;
var dot_speed = 0.5;
var players_at_leftside = {};
var players_at_rightside = {};
players_count = 0;
players_lastupdate = {};

ws.on('connection', function connection(ws, req) {
	ws.on('message', function incoming(message) {
		id = require('crypto').createHash('md5').update(req.headers['x-forwarded-for'].split(/\s*,\s*/)[0]).digest("hex")
		player = JSON.parse(message);
		player.p -= 10;
		players_lastupdate[id] = Math.floor(Date.now() / 1000);
		if(player.p < 0)player.p = 0;
		if(player.p > 80)player.p = 80;
		if(players_at_leftside[id] !== undefined){
			players_at_leftside[id].p = player.p;
		} else if(players_at_rightside[id] !== undefined){
			players_at_rightside[id].p = player.p;
		} else if(player.u !== undefined) {
			if(Object.keys(players_at_leftside).length == Object.keys(players_at_rightside).length){
				if(getRandom(0,1)){
					players_at_leftside[id] = player; 
					console.log("New player " + player.u + " ar left side!");
				} else {
					players_at_rightside[id] = player;
					console.log("New player " + player.u + " ar right side!");
				}
			} else if (Object.keys(players_at_leftside).length > Object.keys(players_at_rightside).length){
				players_at_rightside[id] = player;
				console.log("New player " + player.u + " ar right side!");
			} else {
				players_at_leftside[id] = player;
				console.log("New player " + player.u + " ar left side!");
			}
		}
	});
});

setInterval(function(){
	ws.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify({'d': dot, 'cd': countdown, 'lp': leftpoints, 'rp': rightpoints, 'pals': players_at_leftside, 'pars': players_at_rightside}));
		}
	});
}, 16);

function reset_game() {
	dot_speed = 0.5;
	dot = {'x': 50.0, 'y': 50.0};
	countdown = 3;
	setTimeout(function(){if(players_count > 1)countdown = 2;}, 1000);
	setTimeout(function(){if(players_count > 1)countdown = 1;}, 2000);
	setTimeout(function(){if(players_count > 1)countdown = 0;}, 3000);
}

function getRandom(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(function(){
	if (players_count > 1 && countdown == 0) {
		estimated_top = dot['y'] + dot_speed * Math.cos((180 - dot_angle) * Math.PI / 180).toFixed(3);
		estimated_left = dot['x'] + dot_speed * Math.sin((180 - dot_angle) * Math.PI / 180).toFixed(3);
		if (estimated_top > 100) {
			if (dot_angle > 180) {
				dot_angle += 180 - 2 * (dot_angle - 180);
			} else {
				dot_angle -= 180 - 2 * (180 - dot_angle);
			}
			if (getRandom(0, 1))dot_angle += getRandom(0, 1); else dot_angle -= getRandom(0, 1);
		}
		if (estimated_top < 0) {
			if (dot_angle < 180) {
				dot_angle += 180 - 2 * dot_angle;
			} else {
				dot_angle -= 2 * (dot_angle - 270);
			}
			if (getRandom(0, 1))dot_angle += getRandom(0, 1); else dot_angle -= getRandom(0, 1);
		}
		if (estimated_left > 97) {
			for (id in players_at_rightside) {
				if(Math.abs(players_at_rightside[id].p - (estimated_top - 10)) < 11){
					if (dot_angle > 90) dot_angle += 2 * (180 - dot_angle); else dot_angle -= 2 * dot_angle;
					if (getRandom(0, 1))dot_angle += getRandom(0, 1); else dot_angle -= getRandom(0, 1);
				}
			}
		}
		if (estimated_left < 3) {
			for (id in players_at_leftside) {
				if(Math.abs(players_at_leftside[id].p - (estimated_top - 10)) < 11){
					if (dot_angle > 270)dot_angle += 2 * (360 - dot_angle); else dot_angle -= 2 * (dot_angle - 180);
					if (getRandom(0, 1))dot_angle += getRandom(0, 1); else dot_angle -= getRandom(0, 1);
				}
			}
		}
		if (dot['x'] > 100) {
			leftpoints++;
			reset_game();
		}
		if (dot['x'] < 0) {
			rightpoints++;
			reset_game();
		}
		if (dot_angle > 360) dot_angle -= 360;
		if (dot_angle < 0) dot_angle += 360;
		if (dot_angle > 85 && dot_angle <= 90)dot_angle -= 5;
		if (dot_angle > 90 && dot_angle <= 95)dot_angle += 5;
		if (dot_angle > 170 && dot_angle <= 180)dot_angle -= 10;
		if (dot_angle > 180 && dot_angle <= 190)dot_angle += 10;
		if (dot_angle > 265 && dot_angle <= 270)dot_angle -= 5;
		if (dot_angle > 270 && dot_angle <= 275)dot_angle += 5;
		if (dot_angle > 350 && dot_angle <= 360)dot_angle -= 10;
		if (dot_angle > 0 && dot_angle <= 10)dot_angle += 10;
		dot['y'] = dot['y'] + dot_speed * Math.cos((180 - dot_angle) * Math.PI / 180).toFixed(3);
		dot['x'] = dot['x'] + dot_speed * Math.sin((180 - dot_angle) * Math.PI / 180).toFixed(3);
		if (dot_speed < 4) dot_speed = dot_speed * 1.0001;
	}
}, 8);

setInterval(function(){
	players_count = Object.keys(players_at_leftside).length + Object.keys(players_at_rightside).length;
	for (id in players_at_leftside) {
		if(Math.floor(Date.now() / 1000) - players_lastupdate[id] > 1){
			console.log("Removing "+players_at_leftside[id].u);
			players_at_leftside[id].p = -100;
			setTimeout(function(){delete players_at_leftside[id];}, 100);
		}
	}
	for (id in players_at_rightside) {
		if(Math.floor(Date.now() / 1000) - players_lastupdate[id] > 1){
			console.log("Removing "+players_at_rightside[id].u);
			players_at_rightside[id].p = -100;
			setTimeout(function(){delete players_at_rightside[id];}, 100);
		}
	}
	if(players_count < 2){
		leftpoints = 0;
		rightpoints = 0;
		dot = {'x': 50.0, 'y': 50.0};
		countdown = 404;
	}
	if(players_count > 1 && countdown == 404){
		reset_game();
	}
}, 100);