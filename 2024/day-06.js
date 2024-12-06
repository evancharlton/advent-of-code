const { sanity } = require("../library/sanity");

const data = (type = "") => {
  const grid = require("./input")(__filename, { type, trim: true });
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      if (grid[y][x] === "^") {
        return {
          grid,
          guard: { x, y, v: grid[y][x] },
        };
      }
    }
  }
  throw new Error("?");
};

const STEPS = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
};

const TURNS = {
  "^": ">",
  ">": "v",
  v: "<",
  "<": "^",
};

const part1 = ({ grid, guard }) => {
  const check = sanity(1_000_000);
  const pos = new Set([`${guard.x},${guard.y}`]);

  const steps = [];

  while (true) {
    check();
    steps.push({ ...guard });

    if (
      guard.x < 0 ||
      guard.y < 0 ||
      guard.x >= grid[0].length ||
      guard.y >= grid.length
    ) {
      break;
    }

    pos.add(`${guard.x},${guard.y}`);

    const next = STEPS[guard.v];
    if (!next) {
      throw new Error("I have no idea how the guard is facing");
    }

    // look
    const nextCell = grid[guard.y + next.y]?.[guard.x + next.x];
    if (nextCell === "#") {
      guard.v = TURNS[guard.v];
      continue;
    }

    // leap
    guard.x += next.x;
    guard.y += next.y;
  }

  return pos.size;
};

const part2 = ({ grid: startGrid, guard: startGuard }) => {
  const willLoop = (grid, guard) => {
    const check = sanity(10_000);
    const pos = new Set([]);

    const steps = [];

    while (true) {
      check();
      steps.push({ ...guard });

      if (
        guard.x < 0 ||
        guard.y < 0 ||
        guard.x >= grid[0].length ||
        guard.y >= grid.length
      ) {
        return false;
      }

      const id = [guard.x, guard.y, guard.v].join(",");
      if (pos.has(id)) {
        return true;
      }
      pos.add(id);

      const next = STEPS[guard.v];
      if (!next) {
        throw new Error("I have no idea how the guard is facing");
      }

      // look
      const nextCell = grid[guard.y + next.y]?.[guard.x + next.x];
      if (nextCell === "#" || nextCell === "O") {
        guard.v = TURNS[guard.v];
        continue;
      }

      // leap
      guard.x += next.x;
      guard.y += next.y;
    }
  };

  let totalLoops = 0;
  for (let y = 0; y < startGrid.length; y += 1) {
    for (let x = 0; x < startGrid[y].length; x += 1) {
      if (startGrid[y][x] !== ".") {
        continue;
      }

      const copy = startGrid.map((line, y1) => {
        if (y1 !== y) {
          return line;
        }
        const splat = line.split("");
        splat[x] = "O";
        return splat.join("");
      });

      const loops = willLoop(copy, { ...startGuard });
      if (loops) {
        totalLoops += 1;
      }
    }
  }

  return totalLoops;
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
