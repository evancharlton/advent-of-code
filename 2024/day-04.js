const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true });
};

const DIRECTIONS = [
  { x: 1, y: 0 }, // right
  { x: 1, y: 1 }, // diagonal down-right
  { x: 0, y: 1 }, // down
  { x: -1, y: 1 }, // diagonal down-left
  { x: -1, y: 0 }, // left
  { x: -1, y: -1 }, // diagonal up-left
  { x: 0, y: -1 }, // up
  { x: 1, y: -1 }, // diagonal up-right
];

const part1 = (lines) => {
  let count = 0;
  for (let y = 0; y < lines.length; y += 1) {
    for (let x = 0; x < lines.length; x += 1) {
      if (lines[y][x] !== "X") {
        continue;
      }

      for (const step of DIRECTIONS) {
        const found = [];
        let x1 = x;
        let y1 = y;
        for (let n = 0; n < 4; n += 1) {
          found.push(lines[y1]?.[x1] || "");
          y1 += step.y;
          x1 += step.x;
        }
        const word = found.join("");
        if (word === "XMAS") {
          count += 1;
        }
      }
    }
  }
  return count;
};

const part2 = (lines) => {
  let count = 0;
  for (let y = 0; y < lines.length; y += 1) {
    for (let x = 0; x < lines.length; x += 1) {
      if (lines[y][x] !== "A") {
        continue;
      }

      const a = lines[y - 1]?.[x - 1]; // top-left
      const b = lines[y - 1]?.[x + 1]; // top-right
      const c = lines[y + 1]?.[x + 1]; // bottom-right
      const d = lines[y + 1]?.[x - 1]; // bottom-left

      if (
        ((a === "M" && c === "S") || (a === "S" && c === "M")) &&
        ((d === "M" && b === "S") || (d === "S" && b === "M"))
      ) {
        count += 1;
      }
    }
  }
  return count;
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
