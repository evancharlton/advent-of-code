const data = (type = "") => {
  return require("./input")(__filename, "\n", type).filter(Boolean);
};

const part1 = (lines, mult = 2) => {
  const emptyRows = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (/^\.+$/.test(lines[i])) {
      emptyRows.push(i);
    }
  }

  const emptyCols = [];
  for (let i = 0; i < lines[0].length; i += 1) {
    if (lines.every((line) => line[i] === ".")) {
      emptyCols.push(i);
    }
  }

  const galaxies = [];
  for (let y = 0; y < lines.length; y += 1) {
    for (let x = 0; x < lines[y].length; x += 1) {
      if (lines[y][x] === "#") {
        galaxies.push({ x, y, id: galaxies.length + 1 });
      }
    }
  }

  const d = (x1, x2, e) => {
    return Math.abs(x1 - x2) - e + e * mult;
  };

  const steps = {};
  for (const galaxy of galaxies) {
    for (const other of galaxies) {
      if (galaxy.id === other.id) {
        continue;
      }

      const id = [galaxy.id, other.id].sort((a, b) => +a - +b).join(" <-> ");
      if (steps[id]) {
        continue;
      }

      const emptyRowsCrossed = emptyRows.filter((row) => {
        return (
          row > Math.min(galaxy.y, other.y) && row < Math.max(galaxy.y, other.y)
        );
      }).length;

      const emptyColsCrossed = emptyCols.filter((col) => {
        return (
          col > Math.min(galaxy.x, other.x) && col < Math.max(galaxy.x, other.x)
        );
      }).length;

      const dx = d(galaxy.x, other.x, emptyColsCrossed);
      const dy = d(galaxy.y, other.y, emptyRowsCrossed);

      steps[id] = dx + dy;
    }
  }

  return Object.values(steps).reduce((acc, v) => acc + v);
};

const part2 = (lines, mult = 1_000_000) => {
  return part1(lines, mult);
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
