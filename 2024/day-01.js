const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true })
    .map((line) => line.split(/\s+/))
    .reduce(
      ([o, n], [a, b]) => {
        o.push(+a);
        n.push(+b);
        return [o, n];
      },
      [[], []]
    )
    .map((x) => x.sort());
};

const part1 = ([o, n]) => {
  return o.reduce((sum, a, i) => sum + Math.abs(a - n[i]), 0);
};

const part2 = ([o, n]) => {
  const lookup = n.reduce(
    (acc, b) => ({
      ...acc,
      [b]: (acc[b] || 0) + 1,
    }),
    {}
  );

  return o.reduce((score, a) => score + a * (lookup[a] || 0), 0);
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
