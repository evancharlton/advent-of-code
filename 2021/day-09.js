const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const parse = (data) => data.map((line) => line.split("").map((v) => +v));

const findNadirs = (rawData) => {
  const data = parse(rawData);
  const nadirs = [];
  for (let y = 0; y < data.length; y += 1) {
    for (let x = 0; x < data[y].length; x += 1) {
      const point = data[y][x];
      const above = (data[y - 1] ?? [])[x] ?? Number.MAX_VALUE;
      const below = (data[y + 1] ?? [])[x] ?? Number.MAX_VALUE;
      const right = data[y][x + 1] ?? Number.MAX_VALUE;
      const left = data[y][x - 1] ?? Number.MAX_VALUE;
      if (point < above && point < below && point < right && point < left) {
        nadirs.push({ x, y, value: point });
      }
    }
  }
  return nadirs;
};

const part1 = (data) => {
  return findNadirs(data)
    .map(({ value: v }) => v + 1)
    .reduce((acc, v) => acc + v, 0);
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
};
