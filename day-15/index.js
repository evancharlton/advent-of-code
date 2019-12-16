const readLines = require("../read-input");
const intcode = require("../intcode");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const TEST = false;

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;
const PAUSE = 0;

const WALL = 0;
const MOVED = 1;
const OXYGEN = 2;

const DIR = {
  [NORTH]: "N",
  [EAST]: "E",
  [SOUTH]: "S",
  [WEST]: "W"
};

const drawMap = map => {
  const ranges = Object.keys(map).reduce(
    (ranges, xy) => {
      const [x, y] = xy.split(",").map(v => +v);
      return {
        minX: Math.min(ranges.minX, x),
        maxX: Math.max(ranges.maxX, x),
        minY: Math.min(ranges.minY, y),
        maxY: Math.max(ranges.maxY, y)
      };
    },
    {
      minX: Number.MAX_SAFE_INTEGER,
      maxX: Number.MIN_SAFE_INTEGER,
      minY: Number.MAX_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER
    }
  );
  const width = ranges.maxX - ranges.minX;
  const height = ranges.maxY - ranges.minY;

  const grid = [];
  for (let y = 0; y <= height; y += 1) {
    grid.push([]);
    for (let x = 0; x <= width; x += 1) {
      grid[y].push(" ");
    }
  }

  Object.keys(map).forEach(xy => {
    const [x, y] = xy.split(",").map(v => +v);
    grid[y + Math.abs(ranges.minY)][x + Math.abs(ranges.minX)] = map[xy].sym;
  });

  return grid.map(row => row.join(" ")).join("\n");
};

const MOVES = [
  SOUTH,
  EAST,
  NORTH,
  EAST,
  NORTH,
  EAST,
  NORTH,
  WEST,
  NORTH,
  EAST,
  NORTH,
  WEST,
  NORTH,
  EAST,
  NORTH,
  EAST,
  NORTH,
  WEST,
  NORTH,
  WEST, // Back down
  SOUTH,
  WEST,
  SOUTH,
  WEST,
  SOUTH,
  EAST,
  SOUTH,
  WEST,
  SOUTH,
  WEST,
  SOUTH,
  EAST,
  SOUTH,
  WEST,
  SOUTH,
  EAST,
  SOUTH,
  WEST,
  SOUTH,
  WEST,
  SOUTH,
  WEST,
  SOUTH,
  EAST,
  SOUTH,
  WEST,
  NORTH,
  WEST,
  SOUTH,
  WEST,
  NORTH,
  WEST,
  SOUTH,
  WEST,
  NORTH, // Back up!
  EAST,
  NORTH,
  WEST,
  NORTH,
  EAST,
  NORTH,
  WEST,
  SOUTH,
  WEST,
  NORTH,
  WEST,
  NORTH,
  EAST,
  SOUTH,
  EAST,
  NORTH,
  EAST,
  NORTH,
  WEST,
  NORTH,
  EAST,
  NORTH,
  EAST, // Go east now
  SOUTH,
  EAST,
  NORTH,
  EAST,
  SOUTH,
  WEST,
  SOUTH,
  EAST,
  NORTH,
  EAST,
  NORTH,
  WEST,
  NORTH,
  EAST,
  SOUTH,
  EAST,
  NORTH,
  EAST,
  SOUTH,
  WEST,
  SOUTH,
  WEST,
  SOUTH,
  WEST,
  SOUTH,
  EAST, // Into the middle
  SOUTH,
  WEST,
  PAUSE,
  WEST,
  SOUTH,
  WEST,
  SOUTH,
  EAST,
  SOUTH,
  EAST,
  SOUTH,
  WEST,
  SOUTH,
  // PAUSE
  WEST
  // NORTH,
  // EAST,
  // NORTH,
  // WEST,
  // NORTH
];

readLines("./day-15/input", TEST)
  .then(async ([program]) => {
    const map = { "0,0": "D" };
    const position = {
      x: 0,
      y: 0
    };
    const direction = {
      next: NORTH,
      previous: undefined
    };

    let input = MOVES[0];

    let steps = 0;

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on("keypress", (str, key) => {
      switch (key.sequence) {
        case "N":
        case "w":
          input = NORTH;
          break;
        case "S":
        case "s":
          input = SOUTH;
          break;
        case "W":
        case "a":
          input = WEST;
          break;
        case "E":
        case "d":
          input = EAST;
          break;
        case "z":
          MOVES.shift();
          input = MOVES[0];
          break;
        default:
          console.log("Unknown input:", key.sequence);
          return;
      }
      process.stdout.write("\u0008");
    });

    const nextCoords = dir => {
      switch (dir) {
        case NORTH:
          return [position.x, position.y - 1];
        case SOUTH:
          return [position.x, position.y + 1];
        case WEST:
          return [position.x - 1, position.y];
        case EAST:
          return [position.x + 1, position.y];
      }
    };

    return new Promise(oxygen => {
      intcode(
        program,
        () => {
          return new Promise(resolve => {
            (function getValue() {
              if (input !== undefined) {
                direction.previous = input;
                resolve(direction.previous);
                if (MOVES.length === 0) {
                  // Manual mode
                  console.log("Autopilot disabled");
                  input = undefined;
                } else if (MOVES[0] === PAUSE) {
                  console.log("Autopilot paused");
                  input = undefined;
                } else {
                  input = MOVES[0];
                }
                return;
              }
              setTimeout(getValue, 1);
            })();
          });
        },
        out => {
          // console.error(+out);
          switch (+out) {
            case OXYGEN: {
              const xy = `${position.x},${position.y}`;
              map[xy] = "O";
              console.log("OXYGEN SENSOR FOUND11");
              // throw new Error(steps + 1);
              oxygen(steps + 1);
              break;
            }
            case WALL:
              // Couldn't move, need to change direction
              map[nextCoords(direction.previous).join(",")] = {
                sym: "#",
                visits: Number.MAX_SAFE_INTEGER
              };
              if (MOVES[0] === direction.previous) {
                MOVES.shift();
              }
              break;
            case MOVED:
              // Success
              const xy = `${position.x},${position.y}`;
              const previousVisit = map[xy] || { sym: ".", visits: 0 };
              map[xy] = {
                ...previousVisit,
                sym: ".",
                visits: previousVisit.visits + 1
              };
              map[nextCoords(direction.previous).join(",")] = {
                sym: DIR[direction.previous],
                visits: 0
              };
              const [x, y] = nextCoords(direction.previous);
              position.x = x;
              position.y = y;
              steps += 1;
              break;
          }
          console.clear();
          console.log(drawMap(map));
          console.log("-----", steps, "-----");
        }
      );
    });
  })
  .then(output => {
    if (output !== undefined) {
      if (Array.isArray(output) || typeof output === "object") {
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log(output);
      }
    }
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
