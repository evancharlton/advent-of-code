const { astar } = require("../library/astar");

const data = (type = "") => {
  const grid = require("./input")(__filename, "\n", type).map((line) =>
    line.split("")
  );

  let start = [-1, -1];
  let end = [-1, -1];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "S") {
        start = [x, y];
      } else if (grid[y][x] === "E") {
        end = [x, y];
      }
    }
  }

  return { grid, start, end };
};

const part1 = ({ start, end, grid }) => {
  grid[start[1]][start[0]] = String.fromCharCode("a".charCodeAt(0) - 1);
  grid[end[1]][end[0]] = String.fromCharCode("z".charCodeAt(0) + 1);

  const weights = new Map();
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      const key = `${x},${y}`;
      const letter = grid[y][x];
      weights.set(key, letter.charCodeAt(0));
    }
  }

  const h = (node) => {
    const [x, y] = end;
    const [a, b] = node.split(",").map((v) => +v);
    return Math.abs(x - a) + Math.abs(y - b);
  };

  return (
    astar({
      neighbors: (key) => {
        const [x, y] = key.split(",").map((v) => +v);
        const out = [
          [x, y - 1],
          [x + 1, y],
          [x, y + 1],
          [x - 1, y],
        ]
          .map((xy) => xy.join(","))
          .filter((xy) => weights.has(xy))
          .filter((xy) => {
            return weights.get(xy) - weights.get(key) <= 1;
          });
        return out;
      },
      cost: (key) => weights.get(key),
      start: start.join(","),
      goal: (key) => weights.has(key) && weights.get(key) > "z".charCodeAt(0),
      h,
    }).map((key) => {
      const [x, y] = key.split(",").map((v) => +v);
      return `${key}\t${grid[y][x]}`;
    }).length - 1
  );
};

const part2 = ({ start: end, end: start, grid }) => {
  grid[start[1]][start[0]] = String.fromCharCode("z".charCodeAt(0) + 1);

  const weights = new Map();
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      const key = `${x},${y}`;
      const letter = grid[y][x];
      const score = letter.charCodeAt(0);
      weights.set(key, score);
    }
  }

  const h = (node) => {
    const [x, y] = end;
    const [a, b] = node.split(",").map((v) => +v);
    return Math.abs(x - a) + Math.abs(y - b);
  };

  return (
    astar({
      neighbors: (key) => {
        const [x, y] = key.split(",").map((v) => +v);
        return [
          `${x},${y - 1}`,
          `${x + 1},${y}`,
          `${x},${y + 1}`,
          `${x - 1},${y}`,
        ]
          .filter((xy) => weights.has(xy))
          .filter((xy) => {
            return weights.get(key) - weights.get(xy) <= 1;
          });
      },
      cost: (key) => weights.get(key),
      start: start.join(","),
      goal: (key) => weights.get(key) === "a".charCodeAt(0),
      h,
    }).length - 1
  );
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
