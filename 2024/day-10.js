const { astar } = require("../library/astar");

const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map((line) =>
    line.split("").map((v) => (Number.isNaN(+v) ? -1 : +v))
  );
};

const isReachable = (lines, trailhead, peak) => {
  try {
    astar({
      neighbors: ({ x, y }) => {
        const current = lines[y][x];
        return [
          { x, y: y - 1 },
          { x: x + 1, y },
          { x, y: y + 1 },
          { x: x - 1, y },
        ].filter(({ x, y }) => lines[y]?.[x] === current + 1);
      },

      weight: () => 1,

      start: trailhead,

      h: ({ x, y }) => {
        return Math.abs(trailhead.x - x) + Math.abs(trailhead.y - y);
      },

      goal: ({ x, y }) => x === peak.x && y === peak.y,
    });
    return true;
  } catch {
    // This peak is unreachable
    return false;
  }
};

const part1 = (lines) => {
  const trailheads = [];
  const peaks = [];
  for (let y = 0; y < lines.length; y += 1) {
    const row = lines[y];
    for (let x = 0; x < row.length; x += 1) {
      const cell = row[x];
      if (cell === 0) {
        trailheads.push({ x, y });
      } else if (cell === 9) {
        peaks.push({ x, y });
      }
    }
  }

  return trailheads.reduce(
    (total, trailhead) =>
      total +
      peaks.filter((peak) => isReachable(lines, trailhead, peak)).length,
    0
  );
};

const part2 = (lines) => {
  const countPaths = (lines, { x, y }) => {
    const height = lines[y][x];
    if (height === 9) {
      // We found a peak!
      return 1;
    }

    const current = lines[y][x];
    const neighbors = [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
    ].filter(({ x, y }) => lines[y]?.[x] === current + 1);

    if (neighbors.length === 0) {
      return 0;
    }

    return neighbors.reduce(
      (total, neighbor) => total + countPaths(lines, neighbor),
      0
    );
  };

  const trailheads = [];
  const peaks = [];
  for (let y = 0; y < lines.length; y += 1) {
    const row = lines[y];
    for (let x = 0; x < row.length; x += 1) {
      const cell = row[x];
      if (cell === 0) {
        trailheads.push({ x, y });
      } else if (cell === 9) {
        peaks.push({ x, y });
      }
    }
  }

  return trailheads.reduce(
    (total, trailhead) => total + countPaths(lines, trailhead),
    0
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
