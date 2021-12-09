const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const parse = (data) => data.map((line) => line.split("").map((v) => +v));

const findNadirs = (rawData) => {
  const data = parse(rawData);
  const nadirs = [];
  for (let y = 0; y < data.length; y += 1) {
    for (let x = 0; x < data[y].length; x += 1) {
      const point = data[y][x];
      const above = (data[y - 1] ?? [])[x] ?? Number.MAX_SAFE_INTEGER;
      const below = (data[y + 1] ?? [])[x] ?? Number.MAX_SAFE_INTEGER;
      const right = data[y][x + 1] ?? Number.MAX_SAFE_INTEGER;
      const left = data[y][x - 1] ?? Number.MAX_SAFE_INTEGER;
      if (point < above && point < below && point < right && point < left) {
        nadirs.push({ x, y, value: point });
      }
    }
  }
  return nadirs;
};

const part1 = (data) => {
  return findNadirs(data)
    .map(({ value: v }) => v + 1)
    .reduce((acc, v) => acc + v, 0);
};

const getBasin = (rawData, nadir) => {
  // This is wasteful, but it conveniently gives us a version we can manipulate
  // without polluting subsequent runs.
  const parsed = parse(rawData);

  const basin = [];
  const queue = [`${nadir.x},${nadir.y}`];
  const processed = new Set();
  let i = 0;
  while (queue.length > 0) {
    if (i++ > 10000) {
      // Safety switch :)
      throw new Error("Check your bounds");
    }

    const key = queue.shift();
    processed.add(key);
    const [x, y] = key.split(",").map((v) => +v);
    const value = (parsed[y] ?? [])[x] ?? Number.MAX_SAFE_INTEGER;

    if (value >= 9) {
      // Out of the basin;
      continue;
    }

    // Still in the basin -- add ourselves.
    basin.push({ x, y, value: parsed[y][x] });

    // And put our neighbors on the queue.
    const neighbors = [
      `${x},${y - 1}`,
      `${x},${y + 1}`,
      `${x + 1},${y}`,
      `${x - 1},${y}`,
    ]
      // inefficient but I don't care.
      .filter((k) => !queue.includes(k))
      .filter((k) => !processed.has(k));
    queue.push(...neighbors);
  }

  return basin;
};

const part2 = (data) => {
  return (
    findNadirs(data)
      // Flood fill out from each nadir until we find the borders.
      .reduce((basins, point) => [...basins, getBasin(data, point)], [])
      // We only care about the size of the basin.
      .map((b) => b.length)
      // We want the biggest ones.
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((acc, s) => acc * s)
  );
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
};
