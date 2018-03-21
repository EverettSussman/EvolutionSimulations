// Utils - provides general utility functions

// Assert function
function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

// Random Functions

// n samples, returns 1 with probability p
function bernoulliSample(n, p) {
	tosses = [];
	for (var i = 0; i < n; i++) {
		toss = Math.random();
		if (toss < p) {
			tosses[i] = 1;
		} else {
			tosses[i] = 0;
		}
	}
	return tosses;
}

// k samples, binomial n, p
function binomialSample(k, n, p) {
	ret = [];
	for (var i = 0; i < k; i++) {
		ret[i] = bernoulliSample(n, p).reduce(getSum);
	}
	return ret;
}

function exponentialSample(n, lambda) {
	ret = [];
	for (var i = 0; i < n; i++) {
		ret[i] = -1 / lambda * Math.log(Math.random());
	}
	return ret;
}

function getSum(total, num) {
    return total + num;
}

// Return a random color according to a uniform sample.
function randomColor() {
	return randomInt(3, 0, 255);
}

// Return a random integer from low (inclusive)
// to high (not inclusive)
function randomInt(n, low, high) {
	ret = [];
	for (i = 0; i < n; i++) {
		ret[i] = Math.floor(Math.random() * (high - low) + low);
	}
	return ret;
}

// Returns n random floats from low (inclusive)
// to high (non-inclusive)
function randomFloat(n, low, high) {
	ret = [];
	for (var i = 0; i < n; i++) {
		ret[i] = Math.random() * (high - low) + low;
	}
	return ret;
}

// Returns n unique random integers from 
// low (inclusive) to high (non-inclusive)
function randomShuffle(n, low, high) {
	assert(n <= high - low, "Can't return n unique values" +
							" if fewer than n integers.")
	return shuffleArray(range(low, high)).slice(0, n);
}

// Returs a list of integers from low (inclusive)
// to high (not inclusive)
function range(low, high) {
	ret = [];
	for (var i = low; i < high; i++) {
		ret.push(i);
	}
	return ret
}

// Shuffles array in place using Fisher-Yates 
// algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Convert rgb integer values to a rgb string
function rgb(r, g, b){
  return "rgb("+r+","+g+","+b+")";
}


//------ Tests ------- //


// console.log(bernoulliSample(10, .1))
// console.log(randomFloat(5, 0, 1000))
// console.log(randomInt(20, 0, 1000))
// console.log(randomColor())
// console.log(exponentialSample(20, 2))
// console.log(shuffleArray(range(0, 10)))

// console.log(randomShuffle(20, 5, 26))
