class SimpleOrganism{
	/* x, y correspond to the location of the organism on a canvas.
	Organisms originate with a random color.  They obey the following
	rules: 
		1. after each time step, an organism can mutate with a certain
	probability following the given distribution.
		2. an organism dies with a probability corresponding to its 
	size (larger -> less likely to die)
		3. an organism spreads to neighbors according to the following rule:
			a) whether dead or not
			b) function of genetic makeup
			c) in event of tie, flip coin
	*/
	constructor(x, y, size, deathVal, fitness, id) {
		// Array of positions of location
		// All organisms start with one position
		this.x = x;
		this.y = y;

		this.xPos = x / size;
		this.yPos = y / size;

		this.id = id;
		// Array of rgb colors //
		this.color = randomColor();
		// Number of unit blocks occupied
		this.size = size;
		this.mutateRate = randomFloat(1, 0, 1);

		this.deathVal = deathVal;
		this.dead = false;

		this.fitness = fitness;
	}

	deathBool() {
		// Use deathVal to find probability of 
		// organism dying.  Note that we use 
		// an exponential distribution.
		var lambda = Math.log(this.fitness + Math.E - 1);
		this.dead = exponentialSample(1, lambda) > this.deathVal;
		return this.dead;
	}

	getNeighbors(map) {
		var neighbors = [];

		var maxWidth = map[0].length - 1;
		var maxHeight = map.length - 1;

		// Top Left Case
		if (this.xPos == 0 && this.yPos == 0) {
			neighbors.push([this.xPos + 1, this.yPos]);
			neighbors.push([this.xPos, this.yPos + 1]);
		// Top Right Case
		} else if (this.xPos == maxWidth && this.yPos == 0) {
			neighbors.push([this.xPos - 1, this.yPos]);
			neighbors.push([this.xPos, this.yPos + 1]);
		// Bottom Left Case
		} else if (this.xPos == 0 && this.yPos == maxHeight) {
			neighbors.push([this.xPos, this.yPos - 1]);
			neighbors.push([this.xPos + 1, this.yPos]);
		// Bottom Right Case
		} else if (this.xPos == maxWidth && this.yPos == maxHeight) {
			neighbors.push([this.xPos - 1, this.yPos]);
			neighbors.push([this.xPos, this.yPos - 1]);
		// Top edge Case
		} else if (this.yPos == 0) {
			neighbors.push([this.xPos + 1, this.yPos]);
			neighbors.push([this.xPos, this.yPos + 1]);
			neighbors.push([this.xPos - 1, this.yPos]);
		// Right edge Case
		} else if (this.xPos == maxWidth) {
			neighbors.push([this.xPos, this.yPos - 1]);
			neighbors.push([this.xPos - 1, this.yPos]);
			neighbors.push([this.xPos, this.yPos + 1]);
		// Left edge Case
		} else if (this.xPos == 0) {
			neighbors.push([this.xPos, this.yPos - 1]);
			neighbors.push([this.xPos + 1, this.yPos]);
			neighbors.push([this.xPos, this.yPos + 1]);
		// Bottom edge Case
		} else if (this.yPos == maxHeight) {
			neighbors.push([this.xPos + 1, this.yPos]);
			neighbors.push([this.xPos, this.yPos - 1]);
			neighbors.push([this.xPos - 1, this.yPos]);
		} else {
			neighbors.push([this.xPos + 1, this.yPos]);
			neighbors.push([this.xPos, this.yPos - 1]);
			neighbors.push([this.xPos, this.yPos + 1]);
			neighbors.push([this.xPos - 1, this.yPos]);
		}
		return neighbors;
	}

	getFeasibleNeighbors(map) {
		var neighbors = this.getNeighbors(map);
		neighbors = neighbors.filter(n => map[n[1]][n[0]] != this.id);
		return neighbors;
	}

	draw(ctx) {
		// Draw organism.
		ctx.fillStyle = rgb(this.color[0], 
			this.color[1], this.color[2]);
		ctx.fillRect(this.x, this.y, 
			this.size, this.size);
	}



}

//----- Tests -----//

// cell1 = new SimpleOrganism(10, 10, 5, 1, 2)
