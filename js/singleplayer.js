var gameover = 1;
var dot = document.querySelector("body > .singleplayer .dot");
var countdown = document.querySelector("body > .singleplayer .countdown");
var leftpoints = 0;
var rightpoints = 0;
document.querySelector("body > .singleplayer .rightpoints").innerHTML = rightpoints;
document.querySelector("body > .singleplayer .leftpoints").innerHTML = leftpoints;
var leftpaddle = document.querySelector("body > .singleplayer .leftpaddle");
var rightpaddle = document.querySelector("body > .singleplayer .rightpaddle");
var dot_angle = 45;
var dot_speed = parseInt(document.querySelector(".options input[name=ball_speed]").value);
var difficulty = parseInt(document.querySelector(".options select[name=difficulty]").value);
var leftpaddle_positions = [0];
dot.style.top = window.innerHeight/2 + "px";
dot.style.left = window.innerWidth/2 + "px";

function reset_game(){
	countdown.innerHTML = "3";
	countdown.style.opacity = 1;
	dot_speed = parseInt(document.querySelector(".options input[name=ball_speed]").value);
	dot.style.top = window.innerHeight/2 + "px";
	dot.style.left = window.innerWidth/2 + "px";
	leftpaddle_positions = [0];
	setTimeout(function(){countdown.innerHTML = "2";}, 1000);
	setTimeout(function(){countdown.innerHTML = "1";}, 2000);
	setTimeout(function(){
		countdown.innerHTML = "0";
		countdown.style.opacity = 0;
		gameover = 0;
		sound_paddle.play();
	}, 3000);
}

var frame = setInterval(function(){
	leftborder = leftpaddle.offsetLeft + leftpaddle.offsetWidth;
	leftborder_upperpoint = leftpaddle.offsetTop;
	leftborder_lowerpoint = leftpaddle.offsetTop + leftpaddle.offsetHeight;
	rightborder = rightpaddle.offsetLeft;
	rightborder_upperpoint = rightpaddle.offsetTop;
	rightborder_lowerpoint = rightpaddle.offsetTop + rightpaddle.offsetHeight;

	if (!gameover) {
		estimated_top = parseInt(dot.offsetTop + 2*dot_speed * Math.cos((180 - dot_angle) * Math.PI / 180).toFixed(3));
		estimated_left = parseInt(dot.offsetLeft + 2*dot_speed * Math.sin((180 - dot_angle) * Math.PI / 180).toFixed(3));
		if (estimated_top > window.innerHeight) {
			if (dot_angle > 180) {
				dot_angle += 180 - 2 * (dot_angle - 180);
			} else {
				dot_angle -= 180 - 2 * (180 - dot_angle);
			}
			sound_wall.play();
			if (getRandom(0, 1))dot_angle += getRandom(0, 1); else dot_angle -= getRandom(0, 1);
		}
		if (estimated_top < 0) {
			if (dot_angle < 180) {
				dot_angle += 180 - 2 * dot_angle;
			} else {
				dot_angle -= 2 * (dot_angle - 270);
			}
			sound_wall.play();
			if (getRandom(0, 1))dot_angle += getRandom(0, 1); else dot_angle -= getRandom(0, 1);
		}
		if (estimated_left > rightborder) {
			if ((rightborder_upperpoint - 20) < estimated_top && estimated_top < (rightborder_lowerpoint + 20)) {
				if (dot_angle > 90) dot_angle += 2 * (180 - dot_angle); else dot_angle -= 2 * dot_angle;
				sound_paddle.play();
				if (getRandom(0, 1))dot_angle += getRandom(0, 1); else dot_angle -= getRandom(0, 1);
			} else {
				sound_score.play();
				gameover = 1;
				leftpoints++;
				document.querySelector("body > .singleplayer .leftpoints").innerHTML = leftpoints;
				reset_game();
			}
		}
		if (estimated_left < leftborder) {
			if ((leftborder_upperpoint - 20) < estimated_top && estimated_top < (leftborder_lowerpoint + 20)) {
				if (dot_angle > 270) dot_angle += 2 * (360 - dot_angle); else dot_angle -= 2 * (dot_angle - 180);
				sound_paddle.play();
				if (getRandom(0, 1))dot_angle += getRandom(0, 1); else dot_angle -= getRandom(0, 1);
			} else {			
				sound_score.play();
				gameover = 1;
				rightpoints++;
				document.querySelector("body > .singleplayer .rightpoints").innerHTML = rightpoints;
				reset_game();
			}
		}
		if (dot_angle > 360) dot_angle -= 360;
		if (dot_angle < 0) dot_angle += 360;
		dot.style.top = parseInt(dot.offsetTop + dot_speed * Math.cos((180 - dot_angle) * Math.PI / 180).toFixed(3)) + "px";
		dot.style.left = parseInt(dot.offsetLeft + dot_speed * Math.sin((180 - dot_angle) * Math.PI / 180).toFixed(3)) + "px";
		new_position = dot.offsetTop - window.innerHeight/2;
		new_position = window.innerHeight/2 + new_position * ((window.innerWidth - dot.offsetLeft) / window.innerWidth) - leftpaddle.offsetHeight/2;
		leftpaddle_positions.push(new_position);
		if (leftpaddle_positions.length > difficulty) {
			leftpaddle_positions.shift()
		}
		leftpaddle.style.top = leftpaddle_positions[leftpaddle_positions.length/2] + "px";
		dot_speed = dot_speed * 1.0001;
	}
}, 16);

document.querySelector("body > .singleplayer .input").addEventListener('mousemove', function(e){
	position = (e.offsetY - rightpaddle.offsetHeight/2) / window.innerHeight * 100;
	rightpaddle.style.top = position + "%";
});

reset_game();

document.querySelector("body > .singleplayer .input").addEventListener("touchmove", function(e){ 
	e.preventDefault();
	position = (e.touches[0].clientY - rightpaddle.offsetHeight/2) / window.innerHeight * 100;
	rightpaddle.style.top = position + "%";
}, {passive: false});