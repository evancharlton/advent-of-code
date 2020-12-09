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

for (let i = PREAMBLE_SIZE; i < lines.length; i += 1) {
  const value = lines[i];
  const preamble = lines.slice(i - PREAMBLE_SIZE, i);
  const validNumbers = getValidNumbers(preamble);
  if (!validNumbers.has(value)) {
    console.error(`${value} is not valid`);
    break;
  }
}
