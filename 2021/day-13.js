const data = (type = "") => {
  const [dots, folds] = require("./input")(__filename, "\n\n", type);
  return {
    dots: dots.split("\n").map((line) => line.split(",").map((v) => +v)),
    folds: folds
      .split("\n")
      .map((line) => line.replace("fold along ", "").split("="))
      .map(([dir, offset]) => ({ dir, offset: +offset })),
  };
};

const parse = (lines) => lines;

const createGrid = (dots) => {
  const grid = {};
  dots.forEach(([x, y]) => {
    grid[`${x},${y}`] = "#";
  });
  return grid;
};

const foldGrid = (grid, { dir, offset }) => {
  const folded = {};
  Object.entries(grid).forEach(([key, value]) => {
    const [x, y] = key.split(",").map((v) => +v);
    const f = [x, y];
    if (dir === "y") {
      if (y > offset) {
        f[1] = offset - (y - offset);
      } else if (y === offset) {
        throw new Error(`Dot directly on fold (${key})`);
      }
    } else if (dir === "x") {
      if (x > offset) {
        f[0] = offset - (x - offset);
      } else if (x === offset) {
        throw new Error(`Dot directly on fold (${key})`);
      }
    } else {
      throw new Error(`Unknown direction ${dir}`);
    }
    folded[f.join(",")] = "#";
  });
  return folded;
};

const part1 = ({ dots, folds }) => {
  const grid = createGrid(dots);
  const folded = foldGrid(grid, folds[0]);
  return Object.keys(folded).length;
};

const part2 = (data) => {
  return parse(data);
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
  parse,
};
