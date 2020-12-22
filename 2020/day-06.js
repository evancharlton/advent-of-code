const data = (type = "") => {
  return require("./input")(__filename, "\n\n", type);
};

const part1 = (groups) => {
  return groups
    .map((group) => {
      const answers = group.replace(/\n/g, "").split("");
      return new Set(answers).size;
    })
    .reduce((acc, n) => acc + n, 0);
};

const part2 = (groups) => {
  return groups
    .map((group) => {
      const size = group.split("\n").length;
      const totals = group
        .replace(/\n/g, "")
        .split("")
        .reduce((acc, answer) => {
          return {
            ...acc,
            [answer]: (acc[answer] || 0) + 1,
          };
        }, {});
      return Object.values(totals).filter((total) => total === size).length;
    })
    .reduce((acc, n) => acc + n, 0);
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
