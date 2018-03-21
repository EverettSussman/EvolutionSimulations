var animator = null;
var rest = 50;

$.getJSON("../json/test.json", function(data) {
	console.log(data);

	// Create canvas width 800 height 500
	var c = document.getElementById("loadSimpleEvolutionCanvas");
	var ctx = c.getContext("2d");

	

	// Draw all text describing animation
	function drawText() {
		ctx.fillStyle = "black";
		ctx.font = "20px Georgia";
		var textStart = animateScreenWidth + 20;
		var gps = 1000 / rest;

		ctx.fillText("Generations per Second: " + gps, textStart, 100)
		ctx.fillText("Generation: " + generation, textStart, 130);
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

		drawText();
		generation += 1;
	}

		// Control buttons

	$("#startTest").click(function () {
		console.log("Clicked!");

		initOrganisms();

		if (animator == null) {
			animator = window.setInterval(draw, rest);
		};	
	});

	$("#endTest").click(function () {
		console.log("Clicked!");

		organismList = {};
		environmentMap = [];
		generation = 1;

		clearInterval(animator);
		animator = null;

		ctx.clearRect(0,0, c.width, c.height);

		initOrganisms();
		
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