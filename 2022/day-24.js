const astar = require("../library/astar/astar");

const nonWall = (cell) => cell !== "#";

const NORTH_MASK = 1 << 3;
const SOUTH_MASK = 1 << 2;
const EAST_MASK = 1 << 1;
const WEST_MASK = 1 << 0;
const BASE = 32; // Space in ASCII

// NOTE: Here's some helpers to make the output easier to read:
//   - no storm
// ( - north ^
// $ - south v
// " - east  >
// ! - west  <

const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type)
    .filter(Boolean)
    .map((line) => line.split(""));
  const [first, ...middle] = lines;
  const last = middle.pop();
  const grid = middle.map((lineArr) => {
    lineArr.shift();
    lineArr.pop();
    return lineArr.map((cell) => {
      switch (cell) {
        case ".":
          return BASE;
        case "^":
          return BASE | NORTH_MASK;
        case "v":
          return BASE | SOUTH_MASK;
        case ">":
          return BASE | EAST_MASK;
        case "<":
          return BASE | WEST_MASK;
        default:
          throw new Error(`Unknown input: ${cell}`);
      }
    });
  });
  const startXY = [first.findIndex(nonWall) - 1, -1];
  const endXY = [last.findIndex(nonWall) - 1, grid.length];

  return { startXY, endXY, grid };
};

const fromXY = (xy) => xy.split(",").map((v) => +v);

const ART = {
  [BASE]: ".",
  [BASE | NORTH_MASK]: "^",
  [BASE | SOUTH_MASK]: "v",
  [BASE | EAST_MASK]: ">",
  [BASE | WEST_MASK]: "<",
};

const printCell = (v, simple = true) => {
  if (simple) {
    return (
      ART[v] ??
      Number(v & 0b1111)
        .toString(2)
        .split("")
        .filter((c) => c === "1").length
    );
  }

  if (v === BASE) {
    return "~";
  }
  return String.fromCharCode(v);
};

const print = (...grids) => {
  grids.forEach((grid, i) => {
    i > 0 && console.log("");
    console.log(
      grid.map((row) => row.map((cell) => printCell(cell)).join(" ")).join("\n")
    );
  });
};

const advance = (grid) => {
  const height = grid.length;
  const width = grid[0].length;
  const next = [];
  for (let y = 0; y < height; y += 1) {
    next.push(new Array(width).fill(BASE));
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cell = grid[y][x];
      if ((cell & NORTH_MASK) > 0) {
        // There's a storm moving north; update the cell above
        next[(y + height - 1) % height][x] |= NORTH_MASK;
      }
      if ((cell & SOUTH_MASK) > 0) {
        next[(y + 1) % height][x] |= SOUTH_MASK;
      }
      if ((cell & EAST_MASK) > 0) {
        next[y][(x + 1) % width] |= EAST_MASK;
      }
      if ((cell & WEST_MASK) > 0) {
        next[y][(x + width - 1) % width] |= WEST_MASK;
      }
    }
  }
  return next;
};

const navigate = ({
  startXY,
  endXY: [endX, endY],
  grid: startGrid,
  verbose = false,
  limit = 2000,
}) => {
  const isCellSafe =
    (grid) =>
    ([x, y]) => {
      // Special-case the starting area; these are always safe and we might need
      // to wait for an opening.
      if (y < 0 || y === grid.length || x < 0 || x === grid[y].length) {
        return true;
      }
      const cell = grid[y][x];
      const out = cell === BASE;
      // console.log(`    ${x},${y} => ${cell.toString(2)}`);
      return out;
    };

  const getMoves =
    (nextGrid) =>
    ([x, y]) => {
      const cellChecker = isCellSafe(nextGrid);

      const height = nextGrid.length;
      const width = nextGrid[0].length;

      // Handle the start position differently because it's special - there is
      // only one door into the valley.
      if (y < 0) {
        return [
          [x, y + 1],
          [x, y],
        ].filter(cellChecker);
      } else if (y === height) {
        // This is the end (but start if you're going back)
        return [
          [x, y - 1],
          [x, y],
        ].filter(cellChecker);
      }

      return [
        [x, y - 1], // Will it be safe to go North?
        [x, y + 1], // South?
        [x + 1, y], // East?
        [x - 1, y], // West?
        [x, y], // Am I allowed to stay in place?
      ]
        .filter(([x, y]) => x >= 0 && x < width && y >= 0 && y < height)
        .map(([x, y]) => [(x + width) % width, (y + height) % height])
        .filter(cellChecker);
    };

  let i = 0;
  let currentGrid = startGrid;
  let positions = [startXY];
  for (let minute = 1; minute <= limit; minute += 1) {
    const nextGrid = advance(currentGrid);
    verbose && console.log(`== Minute ${minute} ==`);
    verbose && print(currentGrid, nextGrid);

    const mover = getMoves(nextGrid);

    // Find all new possible moves
    const set = new Set();
    positions = positions
      .map((xy) => {
        const out = mover(xy);
        if (verbose) {
          console.log(`  @ ${xy.join(",")}`);
          out.forEach((optionXY) => {
            console.log(`    => ${optionXY.join(",")}`);
          });
        }
        return out;
      })
      .flat()
      .filter((xy) => {
        const key = xy.join(",");
        if (set.has(key)) {
          return false;
        }
        set.add(key);
        return true;
      });

    if (set.has(`${endX},${endY}`)) {
      return { minutes: minute + 1, grid: advance(nextGrid) }; // Account for exit minute.
    }

    if (positions.length === 0) {
      throw new Error("We're stuck");
    }

    // Advance the clock
    currentGrid = nextGrid;
  }
  const queue = getMoves(startXY, startGrid);
  throw new Error("Couldn't find a safe path!");
};

const part1 = (params) => {
  const { endXY } = params;
  return navigate({
    ...params,
    endXY: [endXY[0], endXY[1] - 1],
  }).minutes;
};

const part2 = (params) => {
  const { startXY, endXY } = params;
  const { minutes: trip1, grid: endGrid } = navigate({
    ...params,
    endXY: [endXY[0], endXY[1] - 1],
  });
  const { minutes: trip2, grid: returnGrid } = navigate({
    ...params,
    grid: endGrid,
    endXY: [0, 0],
    startXY: params.endXY,
  });
  const { minutes } = navigate({
    ...params,
    grid: returnGrid,
    endXY: [endXY[0], endXY[1] - 1],
  });
  return trip1 + trip2 + minutes;
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
