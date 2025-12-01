const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map((line) => {
    return +line.substr(1) * (line[0] === "R" ? 1 : -1);
  });
};

const part1 = (turns) => {
  return turns.reduce(
    ({ current, total }, num) => {
      const next = (current + 100 + num) % 100;
      return { current: next, total: total + (next === 0 ? 1 : 0) };
    },
    { current: 50, total: 0 }
  ).total;
};

const part2 = (lines) => {
  return undefined;
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
