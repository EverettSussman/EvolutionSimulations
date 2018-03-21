

$.getJSON("https://everettsussman.github.io/EvolutionSimulations/json/test.json", function(data) {
	
	// Unpack data 
	var numEpochs = data['numEpochs'];
	var width = data['width'];
	var height = data['height'];
	var numOrgs = data['numOrgs'];
	var deathVal = data['deathVal'];
	var fitness = data['fitness'];
	var states = data['states'];

	var animator = null;
	var rest = 50;
	var generation = 1;

	// Create canvas width 800 height 500
	var c = document.getElementById("loadSimpleEvolutionCanvas");
	var ctx = c.getContext("2d");

	var animateScreenWidth = 500;
	var animateScreenHeight = 500;

	var orgValDict = {0:[255,255,255]}
	for (var i = 0; i < numOrgs; i++) {
		// Make sure index lines up with colony index
		orgValDict[i + 1] = randomColor();
	}

	// Draw all text describing animation
	function drawText(frame) {
		ctx.fillStyle = "black";
		ctx.font = "20px Georgia";
		var textStart = animateScreenWidth + 20;
		var gps = 1000 / rest;

		ctx.fillText("DeathValue: " + deathVal, textStart, 40);
		ctx.fillText("Initial Number of Cols: " + numOrgs, textStart, 70);
		ctx.fillText("Generations per Second: " + gps, textStart, 100)
		ctx.fillText("Generation: " + generation, textStart, 130);

		// Find unique colonies in frame
		var flattened = frame.reduce(function(accumulator, currentValue) {
				return accumulator.concat(currentValue);
		},[]);
		var uniqueCols = new Set(flattened);
		// Don't count blank squares
		uniqueCols.delete(0);
		var colLen = uniqueCols.size;
		ctx.fillText("Colonies: " + colLen, textStart, 160);	
	}

	// Draw a given frame
	function drawCells(frame) {
		var widthScale = Math.floor(animateScreenWidth / width);
		var heightScale = Math.floor(animateScreenHeight / height);

		for (i = 0; i < frame.length; i++) {
			for (j = 0; j < frame[i].length; j++) {
				var cellColor = orgValDict[frame[i][j]]
				var x = j * widthScale;
				var y = i * heightScale;
				ctx.fillStyle = rgb(cellColor[0], cellColor[1], cellColor[2])
				ctx.fillRect(x, y, widthScale, heightScale);
			}
		}
	}

	// Draw everything
	function draw() {

		// Clear canvas
		ctx.clearRect(0, 0, c.width, c.height);

		// Structure animation display
		ctx.beginPath();
		ctx.moveTo(animateScreenWidth, 0);
		ctx.lineTo(animateScreenWidth, animateScreenHeight);
		ctx.stroke();

		drawText(states[generation - 1]);

		drawCells(states[generation - 1]);

		generation += 1;

		if (generation >= states.length) {
			console.log("Finished animation!");
			clearInterval(animator);
			animator = null;
			generation = 1;
		};

	}

		// Control buttons
	

	$("#startTest").click(function () {
		console.log("Clicked!");

		if (animator == null) {
			animator = window.setInterval(draw, rest);
		};	
	});

	$("#endTest").click(function () {
		console.log("Clicked!");

		generation = 1;

		clearInterval(animator);
		animator = null;

		ctx.clearRect(0,0, c.width, c.height);
		
	});

	$('#pauseTest').click(function () {
		console.log("Pause clicked!");
		clearInterval(animator);
		animator = null;
	});

	$('#resumeTest').click(function () {
		console.log("Resume clicked!");

		if (animator == null) {
			animator = window.setInterval(draw, rest);
		};
	});
});