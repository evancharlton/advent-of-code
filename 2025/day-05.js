const data = (type = "") => {
  const [fresh, available] = require("./input")(__filename, {
    type,
    trim: true,
    delim: "\n\n",
  }).map((group) => group.split("\n"));

  return [
    fresh.map((range) => range.split("-").map((v) => +v)),
    available.map((v) => +v),
  ];
};

const part1 = ([fresh, available]) => {
  return available.filter((i) => {
    return fresh.find(([low, high]) => i >= low && i <= high);
  }).length;
};

const part2 = ([fresh, available]) => {
  const ranges = fresh.sort(([a], [b]) => a - b);

  return ranges
    .reduce((acc, curr, i) => {
      if (i === 0) {
        return [curr];
      }
      const prev = acc.pop();

      if (prev[1] >= curr[0]) {
        acc.push([prev[0], Math.max(curr[1], prev[1])]);
      } else {
        acc.push(prev, curr);
      }

      return acc;
    }, [])
    .map(([low, high]) => high - low + 1)
    .reduce((acc, count) => acc + count, 0);
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
