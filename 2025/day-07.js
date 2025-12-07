const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map((line) =>
    line.split("")
  );
};

const part1 = (grid) => {
  let splits = 0;

  for (let y = 1; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      const prev = grid[y - 1][x];
      const curr = grid[y][x];
      if (prev === "S" || prev === "|") {
        // We have a beam! What are we running into at this level?
        if (curr === ".") {
          grid[y][x] = "|";
        } else if (curr === "^") {
          if (grid[y][x - 1] === "^" || grid[y][x + 1] === "^") {
            console.error("REPLACING A TACHYON SPLITTER!");
            return -1;
          }

          if (x > 0) {
            grid[y][x - 1] = "|";
          }
          if (x < grid.length - 1) {
            grid[y][x + 1] = "|";
          }

          splits += 1;
        }
      }
    }
  }
  return splits;
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
