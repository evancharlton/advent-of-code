const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map(Number);
};

const getValidNumbers = (window) => {
  const additions = new Set();
  for (let i = 0; i < window.length; i += 1) {
    for (let j = 0; j < window.length; j += 1) {
      if (i === j) {
        continue;
      }

      additions.add(window[i] + window[j]);
    }
  }

  return additions;
};

const part1 = (lines, preambleSize = 25) => {
  for (let i = preambleSize; i < lines.length; i += 1) {
    const value = lines[i];
    const preamble = lines.slice(i - preambleSize, i);
    const validNumbers = getValidNumbers(preamble);
    if (!validNumbers.has(value)) {
      return value;
    }
  }
};

const part2 = (lines, preambleSize = 25) => {
  let invalidNumber = 0;
  let invalidIndex = 0;
  for (let i = preambleSize; i < lines.length; i += 1) {
    const value = lines[i];
    const preamble = lines.slice(i - preambleSize, i);
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
      return Math.min(...range) + Math.max(...range);
    } else if (sum < invalidNumber) {
      fast += 1;
    } else if (sum > invalidNumber) {
      slow += 1;
      fast = slow + 1;
    }
  }
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
