const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true })[0]
    .split(",")
    .map((pair) => pair.split("-").map((v) => +v));
};

const part1 = (ranges) => {
  const invalidIds = [];
  ranges.forEach(([low, high]) => {
    for (let n = low; n <= high; n += 1) {
      const id = String(n);
      if (/^(.*)\1$/.test(id)) {
        invalidIds.push(n);
      }
    }
  });
  return invalidIds.reduce((acc, n) => acc + n, 0);
};

const part2 = (ranges) => {
  const invalidIds = [];
  ranges.forEach(([low, high]) => {
    for (let n = low; n <= high; n += 1) {
      const id = String(n);
      if (/^(.*)(\1+)$/.test(id)) {
        invalidIds.push(n);
      }
    }
  });
  return invalidIds.reduce((acc, n) => acc + n, 0);
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
