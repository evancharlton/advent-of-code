const lines = require("./input")(__filename).map(Number);

const getValidNumbers = (preambleArr) => {
  const additions = new Set();
  for (let i = 0; i < preambleArr.length; i += 1) {
    for (let j = 0; j < preambleArr.length; j += 1) {
      if (i === j) {
        continue;
      }

      additions.add(preambleArr[i] + preambleArr[j]);
    }
  }

  return additions;
};

const PREAMBLE_SIZE = 25;

let invalidNumber = 0;
let invalidIndex = 0;
for (let i = PREAMBLE_SIZE; i < lines.length; i += 1) {
  const value = lines[i];
  const preamble = lines.slice(i - PREAMBLE_SIZE, i);
  const validNumbers = getValidNumbers(preamble);
  if (!validNumbers.has(value)) {
    invalidNumber = value;
    invalidIndex = i;
    break;
  }
}

let slow = 0;
let fast = 1;

while (slow < invalidIndex) {
  const range = lines.slice(slow, fast);
  const sum = range.reduce((acc, v) => acc + v, 0);
  if (sum === invalidNumber) {
    console.log(Math.min(...range) + Math.max(...range));
    process.exit(0);
  } else if (sum < invalidNumber) {
    fast += 1;
  } else if (sum > invalidNumber) {
    slow += 1;
    fast = slow + 1;
  }
}
