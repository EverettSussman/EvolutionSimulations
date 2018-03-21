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

	// Contains organism objects
	var organismList = {};

	// Create initial map of organism locations
	var environmentMap = [];

	function initOrganisms() {
		for (var i = 0; i < numRows; i++) {
			var row = new Array(numCols).fill(0);
			environmentMap[i] = row;
		}

		// Find coordinates of all organisms
		xyPos = randomShuffle(numOrganisms, 0, numCols * numRows); 
		
		for (var el = 1; el < numOrganisms + 1; el ++) {
			var xyVal = xyPos[el - 1];
			var j = xyVal % numCols;
			var i = Math.floor(xyVal / numCols);

			// Update environmentMap and add organisms
			var id = el;
			environmentMap[i][j] = id;
			newCell = new SimpleOrganism(j * size , 
										 i * size, size, deathVal, 
										 fitness, id);
			organismList[id] = [newCell];
		}
	}

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
		var numColonies = 0;
		var sizeLargestColony = 0;

		for (var id in organismList) {
			var numInColony = organismList[id].length;
			if (organismList[id].length != 0) {
				numColonies++;
				if (numInColony > sizeLargestColony) {
					sizeLargestColony = numInColony;
				}
			}
		}
		ctx.fillText("Colonies: " + numColonies, textStart, 160);

		// Report the size of the largest colonies
		ctx.fillText("Largest Colony: " + sizeLargestColony, textStart, 190);

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

		// Update organisms
		for (var id in organismList) {
			organismList[id].forEach(function(cell) {
				cell.draw(ctx);
				// Check if cell dies
				if (cell.deathBool()) {
					// Update environment map
					environmentMap[cell.yPos][cell.xPos] = 0;
					// remove cell
					organismList[id] = organismList[id].filter(deadCell => (deadCell.yPos != cell.yPos 
													  || deadCell.xPos != cell.xPos));
				} else {
					// Reproduce NO MUTATION IMPLEMENTED YET
					poss = cell.getFeasibleNeighbors(environmentMap);
					maxFree = Math.min(maxChildren, poss.length);
					if (maxFree > 0) {
						var numChildren = binomialSample(1, maxFree, cell.fitness)[0];
					} else {
						var numChildren = 0;
					}
					
					newChildrenLocs = shuffleArray(poss).slice(0, numChildren);
					
					for (var i=0; i < numChildren; i++) {
						// Add new organisms to environment map with same id as parents
						var x = newChildrenLocs[i][0];
						var y = newChildrenLocs[i][1];

						// Consider battles!
						if (environmentMap[y][x] != 0) {
							// Find other organism
							otherId = environmentMap[y][x];
							// Single out cell in that location
							otherCell = organismList[otherId].filter(oc => 
												(oc.yPos == y && oc.xPos == x))[0];
							// Coin toss scenario
							if (otherCell.fitness == cell.fitness) {
								if (bernoulliSample(1, .5)[0] == 1) {
									// kill off otherCell
									environmentMap[otherCell.yPos][otherCell.xPos] = cell.id;
									organismList[otherId] = organismList[otherId].filter(deadCell => (deadCell.yPos != otherCell.yPos 
													  			|| deadCell.xPos != otherCell.xPos));
									victoryCell = new SimpleOrganism(x * size, y * size, size,
																	cell.deathVal, cell.fitness,
																	cell.id);
									victoryCell.color = cell.color;
									organismList[id].push(victoryCell);
								}
							}

						} else {
							environmentMap[y][x] = cell.id;
							// Create new organism with same size, deathval, fitness,
							// as parent organism
							newCell = new SimpleOrganism(x * size, y * size, size,
														cell.deathVal, cell.fitness, 
														cell.id);
							// Make sure it has the same color!
							newCell.color = cell.color;
							// add to list
							organismList[id].push(newCell);
						}
					}
				}
			});
		}

		drawText();
		generation += 1;
	}

		// Control buttons

	$("#start").click(function () {
		console.log("Clicked!");

		initOrganisms();

		if (animator == null) {
			animator = window.setInterval(draw, rest);
		};	
	});

	$("#end").click(function () {
		console.log("Clicked!");

		organismList = {};
		environmentMap = [];
		generation = 1;

		clearInterval(animator);
		animator = null;

		ctx.clearRect(0,0, c.width, c.height);

		initOrganisms();
		
	});

	$('#pause').click(function () {
		console.log("Pause clicked!");
		clearInterval(animator);
		animator = null;
	});

	$('#resume').click(function () {
		console.log("Resume clicked!");

		if (animator == null) {
			animator = window.setInterval(draw, rest);
		};
	});

	
});