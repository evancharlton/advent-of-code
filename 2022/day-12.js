const data = (type = "") => {
  const grid = require("./input")(__filename, "\n", type).map((line) =>
    line.split("")
  );

  let start = [-1, -1];
  let end = [-1, -1];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "S") {
        start = [x, y];
      } else if (grid[y][x] === "E") {
        end = [x, y];
      }
    }
  }

  return { grid, start, end };
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

const pq = (...items) => {
  const queue = [...items];
  const scores = new Map();
  items.forEach((i) => {
    scores.set(i, 0);
  });

  return {
    length: () => queue.length,
    take: () => {
      const first = queue.shift();
      return first;
    },
    put: (key, value) => {
      scores.set(key, value);

      if (value > scores.get(queue[queue.length - 1])) {
        queue.push(key);
        return;
      }

      if (value < scores.get(queue[0])) {
        queue.unshift(key);
        return;
      }

      // Hacky little binary search to find out where it goes.
      let min = 0;
      let max = queue.length;
      let center;
      let limit = 1000;
      while (max - min > 1) {
        center = min + Math.floor((max - min) / 2);
        if (limit-- === 0) {
          throw new Error("Idiot");
        }
        const item = queue[center];
        if (!scores.has(item)) {
          throw new Error(`Missing score for ${item}`);
        }

        const v = scores.get(item);
        if (v > value) {
          max = center;
        } else if (v < value) {
          min = center;
        } else if (v === value) {
          break;
        }
      }
      queue.splice(center, 0, key);
    },
  };
};

const astarMaker = (map, h) => (start, isGoal) => {
  const queue = pq(start);
  const cameFrom = new Map();

  const gScore = new Map(); // ?? Number.MAX_SAFE_INTEGER
  const g = (key) => gScore.get(key) ?? Number.MAX_SAFE_INTEGER;
  gScore.set(start, 0);

  const fScore = new Map(); // ?? Number.MAX_SAFE_INTEGER
  const f = (key) => fScore.get(key) ?? Number.MAX_SAFE_INTEGER;
  fScore.set(start, h(start));

  while (queue.length() > 0) {
    const current = queue.take();
    if (isGoal(current)) {
      return getPath(cameFrom, current);
    }

    const neighbors = map.neighbors(current);
    for (let i = 0; i < neighbors.length; i += 1) {
      const neighbor = neighbors[i];
      const tentativeScore = g(current) + map.get(neighbor);
      if (tentativeScore < g(neighbor)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeScore);
        fScore.set(neighbor, tentativeScore + h(neighbor));
        queue.put(neighbor, f(neighbor));
      }
    }
  }

  throw new Error(`No path found: astar(${map}, ${start})`);
};

const part1 = ({ start, end, grid }) => {
  grid[start[1]][start[0]] = String.fromCharCode("a".charCodeAt(0) - 1);
  grid[end[1]][end[0]] = String.fromCharCode("z".charCodeAt(0) + 1);

  const map1 = new Map();
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      const key = `${x},${y}`;
      const letter = grid[y][x];
      map1.set(key, letter);
    }
  }

  const map = {
    has: (key) => map1.has(key),
    get: (key) => {
      const letter = map1.get(key);
      return letter.charCodeAt(0);
    },

    neighbors: (key) => {
      const [x, y] = key.split(",").map((v) => +v);
      const letter = map1.get(key);
      const val = letter.charCodeAt(0);
      const out = [
        [x, y - 1],
        [x + 1, y],
        [x, y + 1],
        [x - 1, y],
      ]
        .map((xy) => xy.join(","))
        .filter((xy) => map1.has(xy))
        .filter((xy) => {
          const candidate = map1.get(xy);
          const candidateVal = candidate.charCodeAt(0);
          return candidateVal - val <= 1;
        });
      return out;
    },
  };

  const h = (node) => {
    const [x, y] = end;
    const [a, b] = node.split(",").map((v) => +v);
    return Math.abs(x - a) + Math.abs(y - b);
  };

  const astar = astarMaker(map, h);

  return (
    astar(
      start.join(","),
      (key) => map.has(key) && map.get(key) > "z".charCodeAt(0)
    ).map((key) => {
      const [x, y] = key.split(",").map((v) => +v);
      return `${key}\t${grid[y][x]}`;
    }).length - 1
  );
};

const astar = (map, start, goal, h) => {
  const getNeighbors = (key) => {
    const [x, y] = key.split(",").map((v) => +v);
    return [`${x},${y - 1}`, `${x + 1},${y}`, `${x},${y + 1}`, `${x - 1},${y}`]
      .filter((xy) => map.has(xy))
      .filter((xy) => {
        const candidate = map.get(xy);
        const current = map.get(key);
        return current - candidate <= 1;
      });
  };

  const queue = pq(start);
  const cameFrom = new Map();

  const gScore = new Map(); // ?? Number.MAX_SAFE_INTEGER
  const g = (key) => gScore.get(key) ?? Number.MAX_SAFE_INTEGER;
  gScore.set(start, 0);

  const fScore = new Map(); // ?? Number.MAX_SAFE_INTEGER
  const f = (key) => fScore.get(key) ?? Number.MAX_SAFE_INTEGER;
  fScore.set(start, h(start));

  while (queue.length() > 0) {
    const current = queue.take();
    if (goal(current)) {
      return getPath(cameFrom, current);
    }

    const neighbors = getNeighbors(current).filter((key) => map.has(key));
    for (let i = 0; i < neighbors.length; i += 1) {
      const neighbor = neighbors[i];
      const tentativeScore = g(current) + map.get(neighbor);
      if (tentativeScore < g(neighbor)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeScore);
        fScore.set(neighbor, tentativeScore + h(neighbor));
        queue.put(neighbor, f(neighbor));
      }
    }
  }

  throw new Error(`No path found: astar(${map}, ${start}, ${goal})`);
};

const part2 = ({ start: end, end: start, grid }) => {
  grid[start[1]][start[0]] = String.fromCharCode("z".charCodeAt(0) + 1);

  const map1 = new Map();
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      const key = `${x},${y}`;
      const letter = grid[y][x];
      const score = letter.charCodeAt(0);
      map1.set(key, score);
    }
  }

  const map = {
    has: (key) => map1.has(key),
    get: (key) => map1.get(key),

    neighbors: (key) => {
      const [x, y] = key.split(",").map((v) => +v);
      const out = [
        [x, y - 1],
        [x + 1, y],
        [x, y + 1],
        [x - 1, y],
      ]
        .map((xy) => xy.join(","))
        .filter((xy) => map1.has(xy))
        .filter((xy) => {
          const currentValue = map1.get(key);
          const candidateVal = map1.get(xy);
          const diff = currentValue - candidateVal;
          return diff >= 0 && diff <= 1;
        });
      return out;
    },
  };

  const h = (node) => {
    const [x, y] = end;
    const [a, b] = node.split(",").map((v) => +v);
    return Math.abs(x - a) + Math.abs(y - b);
  };

  return (
    astar(
      map1,
      start.join(","),
      (key) => map1.get(key) === "a".charCodeAt(0),
      h
    ).length - 1
  );

  // const astar = astarMaker(map, h);

  // return (
  //   astar(
  //     start.join(","),
  //     (key) => map.has(key) && map.get(key) === "a".charCodeAt(0)
  //   ).map((key) => {
  //     const [x, y] = key.split(",").map((v) => +v);
  //     return `${key}\t${grid[y][x]}`;
  //   }).length - 1
  // );
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
