const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line) => {
    const [x1, y1, x2, y2] = line
      .split(" -> ")
      .map((xy) => xy.split(",").map((v) => +v))
      .flat();
    return { x1, y1, x2, y2 };
  });
};

const reduceMap = (map, { x1, x2, y1, y2 }) => {
  let x = x1;
  let y = y1;
  const dx = x1 === x2 ? 0 : x1 > x2 ? -1 : 1;
  const dy = y1 === y2 ? 0 : y1 > y2 ? -1 : 1;
  while (x !== x2 + dx || y !== y2 + dy) {
    const key = `${x},${y}`;
    map[key] = (map[key] || 0) + 1;
    x += dx;
    y += dy;
  }
  return map;
};

const countCrossings = (map) => Object.values(map).filter((v) => v >= 2).length;

const part1 = (data) => {
  const map = data
    .filter(({ x1, x2, y1, y2 }) => x1 === x2 || y1 === y2)
    .reduce(reduceMap, {});
  return countCrossings(map);
};

const part2 = (data) => {
  const map = data.reduce(reduceMap, {});
  return countCrossings(map);
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
