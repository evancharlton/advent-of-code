const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map((line) =>
    line.split(",").map((v) => +v)
  );
};

const part1 = (tiles) => {
  let biggest = 0;
  for (let a = 0; a < tiles.length; a += 1) {
    for (let b = 0; b < tiles.length; b += 1) {
      if (a === b) continue;

      const [x, y] = tiles[a];
      const [n, m] = tiles[b];

      const area = (Math.abs(n - x) + 1) * (Math.abs(m - y) + 1);
      biggest = Math.max(area, biggest);
    }
  }

  return biggest;
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
