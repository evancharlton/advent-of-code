const { astar } = require("../library/astar")

const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map(line => line.split(''));
};

const split = (xy) => xy.split(',').map(v => +v)
const join = (xy) => xy.join(',')

const solve = (lines, startXY, [endX, endY]) => {
  return astar({
    neighbors: (xy) => {
      const [x, y] = split(xy);
      return [
        [x + 0, y - 1],
        [x + 1, y + 0],
        [x + 0, y + 1],
        [x - 1, y + 0]
      ].filter(([x, y]) => {
        return lines[y][x] !== '#'
      }).map(xy => join(xy))
    },
    weight: () => 1,
    start: join(startXY),
    goal: (xy) => {
      const [x, y] = split(xy);
      return lines[y][x] === 'E'
    },
    h: (xy) => {
      const [x, y] = split(xy);
      return Math.abs(endX - x) + Math.abs(endY - y)
    }
  }).length - 1
}

const part1 = (lines, savings = 100) => {
  // Find all possible walls, try removing them, re-solving, and comparing
  // against the reference time.
  //
  // This is a hacky attempt that surely won't scale to part 2, but let's save
  // that problem for future-me ...

  const cheats = [];
  const startXY = [];
  const endXY = []
  for (let y = 1; y < lines.length - 1; y += 1) {
    for (let x = 1; x < lines.length - 1; x += 1) {
      if (lines[y][x] === '#') {
        if (
          (lines[y - 1][x] !== '#' && lines[y + 1][x] !== '#')
          || (lines[y][x - 1] !== '#' && lines[y][x + 1] !== '#')
        ) {
          cheats.push([x, y])
        }
      } else if (lines[y][x] === 'S') {
        startXY.push(x, y)
      } else if (lines[y][x] === 'E') {
        endXY.push(x, y)
      }
    }
  }
  console.log(`${cheats.length} possible cheats`)

  const benchmark = solve(lines, startXY, endXY)
  console.log(`Benchmark time: ${benchmark}`)
  const pos = [];

  let i = 0;
  for (const [cheatX, cheatY] of cheats) {
    // (i++ % 10 === 0) && console.log(`Trying cheat ${i} of ${wallBlocks.length} ...`)
    try {
      lines[cheatY][cheatX] = 'X';
      const time = solve(lines, startXY, endXY)
      if ((benchmark - time) >= savings) {
        pos.push([cheatX, cheatY])
      }
    } finally {
      lines[cheatY][cheatX] = '#'
    }
  }

  return pos.length
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
