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

const astar = (map, start, goal, h) => {
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
    if (current === goal) {
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

const part1 = (data) => {
  const map = new Map();
  for (let y = 0; y < data.length; y += 1) {
    for (let x = 0; x < data[y].length; x += 1) {
      map.set([x, y].join(","), data[y][x]);
    }
  }

  const y = data.length - 1;
  const x = data[y].length - 1;
  const h = (node) => {
    const [a, b] = node.split(",").map((v) => +v);
    return Math.abs(x - a) + Math.abs(y - b);
  };

  const keys = astar(map, `0,0`, `${x},${y}`, h);
  return keys
    .map((key) => key.split(",").map((v) => +v))
    .map(([x, y]) => data[y][x])
    .reduce((acc, v) => acc + v, -data[0][0]);
};

const part2 = (data) => {
  const megamap = [];
  for (let m = 0; m < 5; m += 1) {
    megamap.push(
      ...data.map((row) => {
        const columns = [];
        for (let n = 0; n < 5; n += 1) {
          columns.push(
            row.map((v) => {
              const next = v + n + m;
              if (next > 9) {
                return next - 9;
              }
              return next;
            })
          );
        }
        return columns.flat();
      })
    );
  }

  return part1(megamap);
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
  pq,
};
