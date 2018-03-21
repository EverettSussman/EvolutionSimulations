# Implement class for organism
import numpy as np

class Organism():
	"""docstring for Organism"""
	def __init__(self, x, y, deathVal, fitness, iD):
		self.x = x
		self.y = y
		self.deathVal = deathVal
		self.fitness = fitness
		self.id = iD

		self.mutateRate = np.random.random()

	def deathBool(self):
		l = np.log(self.fitness + np.exp(1) - 1)
		res = np.random.exponential(l, 1)
		return res > self.deathVal

	def getOpenNeighbors(self, map):
		W = len(map[0]) - 1
		H = len(map) - 1
		neighbors = [(x2, y2) for x2 in range(self.x - 1, self.x + 2)
				for y2 in range(self.y - 1, self.y + 2)
				if (-1 < self.x <= W and -1 < self.y <= H and
					(self.x != x2 or self.y != y2) and 
					(0 <= x2 <= W) and (0 <= y2 <= H) and 
					(np.abs(x2 - self.x) + np.abs(y2 - self.y) < 2))]
		for i, (x, y) in enumerate(neighbors):
			if map[y][x] == self.id:
				del neighbors[i]
		return neighbors



class Map():
	""" Map object """

	def __init__(self, width, height, numOrgs, deathVal, fitness, layout=None):
		self.width = width
		self.height = height

		if layout is None:
			self.terrainValues = np.zeros((height, width))
		else:
			self.terrainValues = layout
		self.organismVals = np.zeros((height, width))
		self.numOrgs = numOrgs
		self.organismsId = {i+1:[] for i in range(numOrgs)}

		self.offSpringLim = 2
		self.deathVal = deathVal
		self.fitness = fitness

		# Set values for organisms
		positions = np.random.choice(range(0, width * height), numOrgs)

		for i, posVal in enumerate(positions):
			iD = i + 1
			x = int(posVal % width)
			y = int(np.floor(posVal / width))
			self.organismVals[y][x] = iD
			newOrg = Organism(x, y, deathVal, fitness, iD)
			self.organismsId[iD].append(newOrg)

	def killCell(self, i, iD, x, y):
		# dead
		self.organismVals[y][x] = 0
		del self.organismsId[iD][i]
			
	def birthCell(self, iD, cell):
		neighborLocs = cell.getOpenNeighbors(self.organismVals)
		maxOffspring = min(self.offSpringLim, len(neighborLocs))
		numChildren = np.random.randint(0, maxOffspring)
		np.random.shuffle(neighborLocs)
		for (x, y) in neighborLocs[:numChildren]:
			self.moveChild(x, y, iD, cell)

	def moveChild(self, x, y, iD, cell):
		# no conflict
		if self.organismVals[y][x] == 0:
			self.organismVals[y][x] = iD
			newChild = Organism(x, y, self.deathVal, cell.fitness, iD)
			self.organismsId[iD].append(newChild)
		else:
			i, otherCell = self.getCellObj(self.organismVals[y][x], x, y)
			if otherCell.fitness == cell.fitness:
				# coin toss
				if np.random.binomial(1, .5) == 1:
					otherId = otherCell.id
					self.killCell(i, otherId, x, y)
					self.organismVals[y][x] = iD
					newChild = Organism(x, y, self.deathVal, cell.fitness, iD)
					self.organismsId[iD].append(newChild)

	def getCellObj(self, iD, x, y):
		for i, cell in enumerate(self.organismsId[iD]):
			if cell.x == x and cell.y == y:
				return i, cell

	def nextMap(self):
		for iD in self.organismsId.keys():
			for i, cell in enumerate(self.organismsId[iD]):
				if cell.deathBool():
					self.killCell(i, iD, cell.x, cell.y)
				else:
					self.birthCell(iD, cell)



# m = Map(10, 10, 4, .2, 1)
# for i in range(10):
# 	print(m.organismVals)
# 	m.nextMap()
# o = Organism(0, 4, 1,1,1)

# print(o.deathBool())
# print(o.getNeighbors(m))



