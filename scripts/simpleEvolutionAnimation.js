var animator = null;
var rest = 50;

$(document).ready(function() {

	// Create canvas width 800 height 500
	var c = document.getElementById("randomEvolutionCanvas");
	var ctx = c.getContext("2d");

	// Used for initial probability of death and fitness
	var deathVal = 4;
	
	// Fitness should be between 0 and 1
	var fitness = .2;

	// Maximal number of offspring per organism
	var maxChildren = 2;

	// Size of individual organisms
	var size = 5;

	// Generation value
	var generation = 1;

	var animateScreenWidth = 500;
	var animateScreenHeight = 500;

	// Find rows and columns for organism locations
	var numCols = Math.floor(animateScreenWidth / size);
	var numRows = Math.floor(animateScreenHeight / size);

	// Will be user supplied
	var numOrganisms = 400;

	var map = new Map(ctx, numRows, numCols, numOrganisms, 
					  size, deathVal, fitness, maxChildren);

	// Draw all text describing animation
	function drawText() {
		ctx.fillStyle = "black";
		ctx.font = "20px Georgia";
		var textStart = animateScreenWidth + 20;
		var gps = 1000 / rest;

		ctx.fillText("DeathValue: " + deathVal, textStart, 40);
		ctx.fillText("Initial Number of Cols: " + numOrganisms, textStart, 70);
		ctx.fillText("Generations per Second: " + gps, textStart, 100)
		ctx.fillText("Generation: " + generation, textStart, 130);

		// Find number of individual colonies
		var numColonies = map.getNumColonies();
		var sizeLargestColony = map.getLargestColony();

		ctx.fillText("Colonies: " + numColonies, textStart, 160);

		// Report the size of the largest colonies
		ctx.fillText("Largest Colony: " + sizeLargestColony, textStart, 190);

	}

	// Draw everything
	function animate() {


		// Clear canvas
		ctx.clearRect(0, 0, c.width, c.height);

		// Structure animation display
		ctx.beginPath();
		ctx.moveTo(animateScreenWidth, 0);
		ctx.lineTo(animateScreenWidth, animateScreenHeight);
		ctx.stroke();

		map.next();
		drawText();
		generation += 1;
	}

		// Control buttons

	$("#start").click(function () {
		console.log("Clicked Start!");

		var map = new Map(ctx, numRows, numCols, numOrganisms, 
					  size, deathVal, fitness, maxChildren);

		if (animator == null) {
			animator = window.setInterval(animate, rest);
		};	
	});

	$("#end").click(function () {
		console.log("Clicked End!");
		generation = 1;

		clearInterval(animator);
		animator = null;

		ctx.clearRect(0,0, c.width, c.height);

		var map = new Map(ctx, numRows, numCols, numOrganisms, 
					  size, deathVal, fitness, maxChildren);
	});

	$('#pause').click(function () {
		console.log("Pause clicked!");
		clearInterval(animator);
		animator = null;
	});

	$('#resume').click(function () {
		console.log("Resume clicked!");

		if (animator == null) {
			animator = window.setInterval(animate, rest);
		};
	});
});