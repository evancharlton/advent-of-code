const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const parse = (data) => data.map((line) => line.split(""));

const OPENING = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

const findCorruption = (line) => {
  const open = [];
  let invalidToken = undefined;
  for (let i = 0; i < line.length; i += 1) {
    const character = line[i];
    if (character in OPENING) {
      open.push(OPENING[character]);
    } else if (open[open.length - 1] === character) {
      open.pop();
    } else {
      invalidToken = character;
      break;
    }
  }
  return { open, invalidToken };
};

const part1 = (data) => {
  const POINTS = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };

  return parse(data)
    .map((line) => findCorruption(line).invalidToken)
    .filter(Boolean)
    .map((c) => POINTS[c])
    .reduce((acc, p) => acc + p);
};

const part2 = (data) => {
  const POINTS = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };

  const scores = parse(data)
    // Remove the corrupted lines; we only want the incomplete ones.
    .map((line) => findCorruption(line))
    .filter(({ invalidToken }) => !invalidToken)
    .map(({ open }) => open.reverse())
    .map((completion) =>
      completion.map((c) => POINTS[c]).reduce((acc, p) => acc * 5 + p, 0)
    )
    .sort((a, b) => b - a);
  return scores[Math.floor(scores.length / 2)];
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
  findCorruption,
};
