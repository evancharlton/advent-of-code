const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .map((v) => v.replace(/^\+/, ""))
    .map(Number);
};

const part1 = (values) => {
  return values.reduce((acc, v) => acc + v, 0);
};

const part2 = (robots) => {
  return undefined;
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
