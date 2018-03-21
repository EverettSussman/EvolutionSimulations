# run game
from organism import *
import json
import tqdm


def main():

	numEpochs = 100

	width = 10
	height = 10
	numOrgs = 4
	deathVal = 4
	fitness = .2

	world = Map(width, height, numOrgs, 
				deathVal, fitness)

	allMapInfo = {'numEpochs': numEpochs,
		'width':width, 'height':height,
		'numOrgs':numOrgs, 'deathVal':deathVal,
		'fitness':fitness, 'states':[]}

	# run 1000 epochs
	for i in tqdm.trange(1000):
		allMapInfo['states'].append(world.organismVals.tolist())
		world.nextMap()

	# dump json
	with open('../json/test.json', 'w') as fout:
		json.dump(allMapInfo, fout)
	print('Finished simulation.')

if __name__ == '__main__':
	main()