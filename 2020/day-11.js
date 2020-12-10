const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type).map(Number);
  lines.sort((a, b) => a - b);
  return lines;
};

const part1 = (lines) => {
  return undefined;
};

const part2 = (lines) => {
  return undefined;
};

module.exports = {
  data,
  part1,
  part2,
};
