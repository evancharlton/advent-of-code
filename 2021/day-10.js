const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const parse = (data) => data.map((line) => line.split(""));

const CLOSING = {
  ")": "(",
  "]": "[",
  "}": "{",
  ">": "<",
};

const OPENING = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

const findCorruption = (line) => {
  const open = [];
  for (let i = 0; i < line.length; i += 1) {
    const character = line[i];
    if (character in OPENING) {
      open.push(OPENING[character]);
    } else if (open[open.length - 1] === character) {
      open.pop();
    } else {
      return character;
    }
  }
};

const findCorruptions = (data) => {
  return parse(data)
    .map((line) => findCorruption(line))
    .filter(Boolean);
};

const POINTS = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const part1 = (data) => {
  return findCorruptions(data)
    .map((c) => POINTS[c])
    .reduce((acc, p) => acc + p);
};

const part2 = (data) => {
  return data;
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
  parse,
  findCorruptedLines: findCorruptions,
  findCorruption,
};
