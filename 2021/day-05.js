const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line) => {
    const [x1, y1, x2, y2] = line
      .split(" -> ")
      .map((xy) => xy.split(",").map((v) => +v))
      .flat();
    return { x1, y1, x2, y2 };
  });
};

const part1 = (data) => {
  const map = {};
  data
    .filter(({ x1, x2, y1, y2 }) => x1 === x2 || y1 === y2)
    .forEach(({ x1, x2, y1, y2 }) => {
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x += 1) {
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y += 1) {
          const key = `${x},${y}`;
          map[key] = (map[key] || 0) + 1;
        }
      }
    });
  return Object.values(map).filter((v) => v >= 2).length;
};

const part2 = (data) => {
  const map = {};
  data
    .filter(({ x1, x2, y1, y2 }) => x1 === x2 || y1 === y2)
    .forEach(({ x1, x2, y1, y2 }) => {
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x += 1) {
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y += 1) {
          const key = `${x},${y}`;
          map[key] = (map[key] || 0) + 1;
        }
      }
    });
  data
    .filter(({ x1, x2, y1, y2 }) => !(x1 === x2 || y1 === y2))
    .forEach(({ x1, x2, y1, y2 }) => {
      let x = x1;
      let y = y1;
      const dx = x1 > x2 ? -1 : 1;
      const dy = y1 > y2 ? -1 : 1;
      while (x !== x2 + dx && y !== y2 + dy) {
        const key = `${x},${y}`;
        map[key] = (map[key] || 0) + 1;
        x += dx;
        y += dy;
      }
    });

  return Object.values(map).filter((v) => v >= 2).length;
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