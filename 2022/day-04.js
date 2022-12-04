const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .map((line) => line.split(","))
    .map((ranges) => ranges.map((range) => range.split("-").map(Number)));
};

const part1 = (pairs) => {
  return pairs.reduce((count, [a, b]) => {
    const [minA, maxA] = a;
    const [minB, maxB] = b;

    if ((minA >= minB && maxA <= maxB) || (minB >= minA && maxB <= maxA)) {
      return count + 1;
    }

    return count;
  }, 0);
};

const part2 = (pairs) => {
  return pairs.reduce((count, [a, b]) => {
    const [minA, maxA] = a;
    const [minB, maxB] = b;

    if ((minA >= minB && minA <= maxB) || (minB >= minA && minB <= maxA)) {
      return count + 1;
    }

    return count;
  }, 0);
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
