const data = (type = "") => {
  return require("./input")(__filename, "\n", type).join("");
};

const poles = (a, b) => {
  return a !== b && a.toUpperCase() === b.toUpperCase();
};

const part1 = (input) => {
  let polymer = input;
  outer: while (true) {
    for (let i = 0; i < polymer.length - 1; i += 1) {
      const a = polymer[i];
      const b = polymer[i + 1];
      if (poles(a, b)) {
        polymer = polymer.substr(0, i) + polymer.substr(i + 2);
        continue outer;
      }
    }
    return polymer.length;
  }
};

const part2 = (input) => {
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
