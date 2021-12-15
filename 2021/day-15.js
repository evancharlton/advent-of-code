const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line) =>
    line.split("").map((v) => +v)
  );
};

const getPath = (cameFrom, current) => {
  let n = current;
  const out = [];
  while (n) {
    out.unshift(n);
    n = cameFrom.get(n);
  }
  return out;
};

const getNeighbors = (key) => {
  const [x, y] = key.split(",").map((v) => +v);
  return [`${x},${y - 1}`, `${x + 1},${y}`, `${x},${y + 1}`, `${x - 1},${y}`];
};

const astar = (map, start, goal, h) => {
  const openSet = new Set([start]);
  const cameFrom = new Map();

  const gScore = new Map(); // ?? Number.MAX_SAFE_INTEGER
  const g = (key) => gScore.get(key) ?? Number.MAX_SAFE_INTEGER;
  gScore.set(start, 0);

  const fScore = new Map(); // ?? Number.MAX_SAFE_INTEGER
  const f = (key) => fScore.get(key) ?? Number.MAX_SAFE_INTEGER;
  fScore.set(start, h(start));

  let limit = 10000;
  while (openSet.size > 0 && limit-- > 0) {
    const sortedOpenSet = [...openSet].sort((a, b) => f(a) - f(b));
    const current = sortedOpenSet[0];
    if (current === goal) {
      return getPath(cameFrom, current);
    }

    openSet.delete(current);
    const neighbors = getNeighbors(current).filter((key) => map.has(key));
    for (let i = 0; i < neighbors.length; i += 1) {
      const neighbor = neighbors[i];
      const tentativeScore = g(current) + map.get(neighbor);
      if (tentativeScore < g(neighbor)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeScore);
        fScore.set(neighbor, tentativeScore + h(neighbor));
        openSet.add(neighbor);
      }
    }
  }

  throw new Error("Oops");
};

const part1 = (data) => {
  const map = new Map();
  let lastKey = "";
  for (let y = 0; y < data.length; y += 1) {
    for (let x = 0; x < data.length; x += 1) {
      lastKey = `${x},${y}`;
      map.set(lastKey, data[y][x]);
    }
  }

  const [x, y] = lastKey.split(",").map((v) => +v);
  const h = (node) => {
    const [a, b] = node.split(",").map((v) => +v);
    return Math.abs(x - a) + Math.abs(y - b);
  };

  const keys = astar(map, `0,0`, lastKey, h);
  return keys
    .map((key) => key.split(",").map((v) => +v))
    .map(([x, y]) => data[y][x])
    .reduce((acc, v) => acc + v, -data[0][0]);
};

const part2 = (data) => {
  return data;
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
