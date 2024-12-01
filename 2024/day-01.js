const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .map((line) => line.split(/\s+/))
    .reduce(
      ([o, n], [a, b]) => {
        o.push(+a);
        n.push(+b);
        return [o, n];
      },
      [[], []]
    )
    .map((x) => {
      return x.sort();
    });
};

const part1 = ([o, n]) => {
  return o.reduce((sum, a, i) => {
    return sum + Math.abs(a - n[i]);
  }, 0);
};

const part2 = ([o, n]) => {
  return o.reduce((score, a) => {
    return (
      score +
      a *
        n.reduce((count, b) => {
          if (b !== a) {
            return count;
          }
          return count + 1;
        }, 0)
    );
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
