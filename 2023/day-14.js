const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .filter(Boolean)
    .map((line) => line.split(""));
};

const part1 = (lines) => {
  columns: for (let x = 0; x < lines[0].length; x += 1) {
    for (let y = 0; y < lines.length; y += 1) {
      const cell = lines[y][x];
      if (cell !== ".") {
        continue;
      }

      // Look downwards and see if we can find a rock that should roll.
      for (let y1 = y; y1 < lines.length; y1 += 1) {
        const other = lines[y1][x];
        if (other === "#") {
          break;
        }
        if (other === "O") {
          // Move it up to where I am
          lines[y][x] = "O";
          lines[y1][x] = ".";
          break;
        }
      }
    }
  }

  return lines
    .map((line, i, data) => {
      return (data.length - i) * line.filter((v) => v === "O").length;
    })
    .reduce((acc, v) => acc + v);
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
