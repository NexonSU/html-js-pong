var sound_paddle = new Audio('sound/paddle.mp3');
var sound_wall = new Audio('sound/wall.mp3');
var sound_score = new Audio('sound/score.mp3');
var current_layer = "menu";
var sockets = [];

function change_layer(layer_name) {
	document.body.style.display = "none";
	for (var i = setTimeout(function() {}, 0); i > 0; i--) {
		window.clearInterval(i);
		window.clearTimeout(i);
		if (window.cancelAnimationFrame) window.cancelAnimationFrame(i);
	}
	for (s in sockets) sockets[s].close();
	document.querySelector("#js").remove();
	document.querySelector("body > ." + current_layer).style.display = "none";
	js = document.createElement('script');
	js.src = "/js/" + layer_name + ".js?" + Math.floor(Date.now() / 1000);
	js.id = "js";
	document.head.appendChild(js);
	document.querySelector("body > ." + layer_name).removeAttribute("style");
	current_layer = layer_name;
	sound_paddle.play();
	document.body.removeAttribute("style");
	window.location.hash = layer_name;
}

function getRandom(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('DOMContentLoaded', function(){
	sound_paddle.volume = 0.2;
	sound_wall.volume = 0.2;
	sound_score.volume = 0.2;

	if(window.location.hash == "")change_layer("menu");else change_layer(window.location.hash.split("#")[1]);

	if (localStorage.getItem("username") != null) {
		document.querySelector(".options input[name=\"username\"]").value = localStorage.username;
	} else {
		document.querySelector(".options input[name=\"username\"]").value = "Player#" + getRandom(10000, 99999);
	}

	if (localStorage.getItem("difficulty") != null) {
		document.querySelector(".options select[name=\"difficulty\"]").value = localStorage.difficulty;
	}

	if (localStorage.getItem("ball_speed") != null) {
		document.querySelector(".options input[name=\"ball_speed\"]").value = localStorage.ball_speed;
	}

	if (localStorage.getItem("volume") != null) {
		document.querySelector(".options input[name=\"volume\"]").value = localStorage.volume;
		sound_paddle.volume = localStorage.volume;
		sound_wall.volume = localStorage.volume;
		sound_score.volume = localStorage.volume;
	}
});

for (var i = setTimeout(function() {}, 0); i > 0; i--) {
	window.clearInterval(i);
	window.clearTimeout(i);
	if (window.cancelAnimationFrame) window.cancelAnimationFrame(i);
}

Audio.prototype.play = (function(play) {
return function () {
	var audio = this, args = arguments, promise = play.apply(audio, args);
	if (promise !== undefined) {
		promise.catch(_ => {
			//audio disabled
		});
	}
};
})(Audio.prototype.play);