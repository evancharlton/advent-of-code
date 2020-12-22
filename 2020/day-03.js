const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const simulate = (lines) => (deltaX, deltaY) => {
  let treeCount = 0;
  let x = 0;
  let y = 0;
  while (y < lines.length) {
    const row = lines[y];
    const slot = row[x];
    if (slot === "#") {
      treeCount += 1;
    }
    x = (x + deltaX) % row.length;
    y += deltaY;
  }
  return treeCount;
};

const part1 = (lines) => {
  return simulate(lines)(3, 1);
};

const part2 = (lines) => {
  const simulator = simulate(lines);

  const values = [
    simulator(1, 1),
    simulator(3, 1),
    simulator(5, 1),
    simulator(7, 1),
    simulator(1, 2),
  ];

  return values.reduce((acc, v) => acc * v, 1);
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
