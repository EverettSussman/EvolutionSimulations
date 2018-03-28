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
	constructor(x, y, size, deathVal, fitness, colonyNum, id, mutation) {
		// Array of positions of location
		// All organisms start with one position
		this.x = x;
		this.y = y;

		this.xPos = x / size;
		this.yPos = y / size;

		this.colonyNum = colonyNum;
		this.id = id;

		// Array of rgb colors //
		this.color = randomColor();
		// Number of unit blocks occupied
		this.size = size;
		this.mutateRate = randomFloat(1, 0, 1);

		this.deathVal = deathVal;
		this.dead = false;

		this.fitness = fitness;

		// Determines whether to include genetic drift
		// boolean
		this.mutation = mutation;
	}

	move(map) {
		// Check if cell dies
		if (this.deathBool(map)) {
			map.removeCell(this);
		} else {
			// Get children locations (may be 0)
			var childrenLocs = this.getChildrenLocs(map); // Implement
			
			for (var i = 0; i < childrenLocs.length; i++) {
				this.placeBirthChild(childrenLocs[i], map);
			}
		}
	}

	deathBool(map) {
		// Use deathVal to find probability of 
		// organism dying.  Note that we use 
		// an exponential distribution.
		// Check whether organism is fit to live in cell
		if (map.world[this.yPos][this.xPos] > this.fitness) {
			this.dead = true;
		} else {
			var lambda = Math.log(this.fitness + Math.E - 1);
			this.dead = exponentialSample(1, lambda) > this.deathVal;
		}
		return this.dead;
	}

	getChildrenLocs(map) {
		// Returns the locations for the children of a cell
		var poss = this.getFeasibleNeighbors(map.cellMap);
		var maxFree = Math.min(map.maxChildren, poss.length);
		if (maxFree > 0) {
			var numChildren = binomialSample(1, maxFree, this.fitness)[0];
		} else {
			var numChildren = 0;
		}
		return shuffleArray(poss).slice(0, numChildren);
	}

	getNeighbors(cellMap) {
		var neighbors = [];

		var maxWidth = cellMap[0].length - 1;
		var maxHeight = cellMap.length - 1;

		for (var x2 = this.xPos - 1; x2 < this.xPos + 2; x2++) {
			for (var y2 = this.yPos - 1; y2 < this.yPos + 2; y2++) {
				if ((this.xPos != x2 || this.yPos != y2) 
				&& (0 <= x2 && x2 <= maxWidth) 
				&& (0 <= y2 && y2 <= maxHeight)
				&& (Math.abs(x2 - this.xPos) + Math.abs(y2 - this.yPos) < 2)) {
					neighbors.push([x2, y2])
				}
			}
		}
		return neighbors;
	}

	getFeasibleNeighbors(cellMap) {
		var neighbors = this.getNeighbors(cellMap);
		neighbors = neighbors.filter(n => cellMap[n[1]][n[0]] != this.colonyNum);
		return neighbors;
	}

	genNewChild(idVal, x, y) {
		if (this.mutation) {
			// try deviation of .01
			var low = this.fitness - .01;
			var high = this.fitness + .01;
			var newFitness = randomFloat(1, low, high)[0];
			var childCell = new SimpleOrganism(x * this.size, y * this.size, 
								this.size, this.deathVal, newFitness, 
								this.colonyNum, idVal, this.mutation);
		} else {
			var childCell = new SimpleOrganism(x * this.size, y * this.size, 
								this.size, this.deathVal, this.fitness, 
								this.colonyNum, idVal, this.mutation);
		}
		childCell.color = this.color;
		return childCell;
	}

	placeBirthChild(loc, map) {
		// handles birth of new cell
		var x = loc[0];
		var y = loc[1];

		// Consider battles!
		if (map.cellMap[y][x] == 0) {
			// Not considering fitness of terrain
			map.addCell(this.genNewChild(map.idVal, x, y));
		} else {
			var otherCell = map.getCellByLoc(loc);
			// Determine probability of this cell winning
			// by ratio this.fitness / sum fitness
			var p = this.fitness / (this.fitness + otherCell.fitness);
			if (bernoulliSample(1, p)[0] == 1) {
					// kill off otherCell
					map.removeCell(otherCell);
					map.addCell(this.genNewChild(map.idVal, x, y));
			}
		}
	}

	draw(ctx) {
		// Draw organism.
		ctx.fillStyle = rgb(this.color[0], 
			this.color[1], this.color[2]);
		ctx.fillRect(this.x, this.y, 
			this.size, this.size);
	}
}

class Map{

	constructor(ctx, numRows, numCols, numCells, size, deathVal, fitness, maxChildren, mutation, layout) {
		this.ctx = ctx;

		this.rows = numRows;
		this.cols = numCols;

		this.size = size;
		this.deathVal = deathVal;
		this.fitness = fitness;
		this.maxChildren = maxChildren;

		this.numCells = numCells;

		this.idVal = 0;
		

		// Stores fitness levels needed to be in location
		this.world = new Array(numRows);

		// Stores locations of colonies on map for rendering
		this.cellMap = new Array(numRows);
		this.cells = {};

		this.mutation = mutation;

		for (var i = 0; i < numRows; i++) {
				var row = new Array(numCols).fill(0);
				var row2 = new Array(numCols).fill(0);
				this.world[i] = row;
				this.cellMap[i] = row2;
		} 

		if (layout === undefined) {
			this.world = this.world;
		} else {
			console.log('hi');
			this.world = layout;
		}

		// Find coordinates of all organisms
		var xyPos = randomShuffle(numCells, 0, numCols * numRows); 
		
		// Default in cell map is 0, so cell colonyNums start with 1
		for (var colNum = 1; colNum < numCells + 1; colNum ++) {
			var xyVal = xyPos[colNum - 1];
			var x = xyVal % numCols;
			var y = Math.floor(xyVal / numCols);

			// Update world and add organisms
			this.cellMap[y][x] = colNum;
			var newCell = new SimpleOrganism(x * size , 
										 y * size, size, deathVal, 
										 fitness, colNum, this.idVal, 
										 this.mutation);
			var initDict = {};
			initDict[this.idVal] = newCell;
			this.cells[colNum] = initDict;
			this.idVal += 1;
		}
	}

	next() {
		for (var col in this.cells) {
			for (var id in this.cells[col]) {
				var cell = this.cells[col][id];
				cell.draw(this.ctx);
				// Move cell
				cell.move(this);
			}
		}
	}

	removeCell(cell) {
		this.cellMap[cell.yPos][cell.xPos] = 0;
		delete this.cells[cell.colonyNum][cell.id]
		// Remove colony if no more survivors
		if (jQuery.isEmptyObject(this.cells[cell.colonyNum])) {
			delete this.cells[cell.colonyNum];
		}
	}

	addCell(cell, loc) {
		this.cells[cell.colonyNum][this.idVal] = cell;
		this.idVal += 1;
		this.cellMap[cell.yPos][cell.xPos] = cell.colonyNum;
	}

	getCellByLoc(loc) {
		var x = loc[0];
		var y = loc[1];
		var colNum = this.cellMap[y][x];
		var otherCell;
		for (var id in this.cells[colNum]) {
			if (this.cells[colNum][id].xPos == x && this.cells[colNum][id].yPos == y) {
				otherCell = this.cells[colNum][id];
			}
		}
		return otherCell;
	}

	getNumColonies() {
		return Object.keys(this.cells).length;
	}

	getLargestColony() {
		var largestCol = 0;
		for (var col in this.cells) {
			var colSize = Object.keys(this.cells[col]).length;
			if (colSize > largestCol) {
				largestCol = colSize;
			}
		}
		return largestCol;
	}
}

//----- Tests -----//

// cell1 = new SimpleOrganism(10, 10, 5, 1, 2)
