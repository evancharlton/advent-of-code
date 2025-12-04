const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true });
};

const part1 = (lines) => {
  let num = 0;
  for (let y = 0; y < lines.length; y += 1) {
    for (let x = 0; x < lines[y].length; x += 1) {
      const me = lines[y][x];
      if (me !== "@") {
        continue;
      }

      const neighbors = [
        lines[y - 1]?.[x - 1] ?? " ",
        lines[y - 1]?.[x] ?? " ",
        lines[y - 1]?.[x + 1] ?? " ",
        lines[y]?.[x - 1] ?? " ",
        lines[y]?.[x + 1] ?? " ",
        lines[y + 1]?.[x - 1] ?? " ",
        lines[y + 1]?.[x] ?? " ",
        lines[y + 1]?.[x + 1] ?? " ",
      ];

      const count = neighbors.reduce(
        (acc, v) => (v === "@" ? acc + 1 : acc),
        0
      );
      if (count < 4) {
        num += 1;
      }
    }
  }
  return num;
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
