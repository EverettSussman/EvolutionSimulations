# run game
from organism import *
import json
import tqdm


def main():

	numEpochs = 100

	width = 50
	height = 50
	numOrgs = 100
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
	with open('../json/testlarge.json', 'w') as fout:
		json.dump(allMapInfo, fout)
	print('Finished simulation.')

if __name__ == '__main__':
	main()