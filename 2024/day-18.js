const { astar } = require("../library/astar");
const { sanity } = require("../library/sanity");

const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map((line) =>
    line.split(",").map((v) => +v),
  );
};

const part1 = (lines, { size = 71, cap = 1024 } = {}) => {
  const check = sanity(Math.pow(size, 3));
  const grid = lines.slice(0, cap).reduce((acc, xy) => ({ ...acc, [xy.join(",")]: "#" }), {});

  const visits = {}
  const path = [];
  try {
    const steps = astar({
      neighbors: (xy) => {
        const [x, y] = xy.split(',').map(v => +v)
        const n = [
          [x + 0, y - 1],
          [x + 1, y + 0],
          [x + 0, y + 1],
          [x - 1, y + 0],
        ]
          .filter(([x, y]) => x >= 0 && x < size && y >= 0 && y < size)
          .filter((xy) => grid[xy.join(",")] !== "#")
          .map(xy => xy.join(','))

        for (const neighbor of n) {
          visits[neighbor] = (visits[neighbor] ?? 0) + 1
        }

        // console.log(`[${xy}] -> ${n.join(' ')}`)
        return n
      },
      weight: (xy) => 1,
      start: "0,0",
      goal: xy => {
        const [x, y] = xy.split(',').map(v => +v)
        return x === size - 1 && y === size - 1;
      },
      h: xy => {
        const [x, y] = xy.split(',').map(v => +v)
        return Math.abs(size - x) + Math.abs(size - y);
      },
      sanityCheck: check,
    });
    path.push(...steps)
  } finally {
    // const pathMap = path.reduce((acc, xy) => ({ ...acc, [xy]: '⨯' }), {})
    // const output = []
    // for (let y = 0; y < size; y += 1) {
    //   const row = [];
    //   for (let x = 0; x < size; x += 1) {
    //     const key = `${x},${y}`
    //     row.push(pathMap[key] ?? ((grid[key] ?? " ")))
    //   }
    //   output.push(row.join(' '))
    // }
    // console.log(`\n${output.join('\n')}`)
  }

  return path.length - 1
};

const part2 = (lines) => {
  return undefined;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  const tweaks = {
    test: { size: 7, cap: 12 }
  }
  console.log(`Part 1:`, part1(data(process.argv[2] || ""), tweaks[process.argv[2]]));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
