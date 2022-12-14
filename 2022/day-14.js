const ROCK = "#";
const SAND = ".";

const cap = (d) => {
  if (d === 0) {
    return 0;
  }
  if (d > 0) {
    return 1;
  }
  if (d < 0) {
    return -1;
  }
};

const data = (type = "") => {
  const traces = require("./input")(__filename, "\n", type).map((trace) =>
    trace.split(" -> ").map((pair) => pair.split(",").map((n) => +n))
  );
  const map = new Map();
  traces.forEach((trace) => {
    trace.forEach((point, i, data) => {
      if (i === data.length - 1) {
        return;
      }

      const [startX, startY] = point;
      const [endX, endY] = data[i + 1];
      const dx = cap(endX - startX);
      const dy = cap(endY - startY);

      let x = startX;
      let y = startY;
      while (true) {
        map.set(`${x},${y}`, ROCK);

        if (x === endX && y === endY) {
          break;
        }

        x += dx;
        y += dy;
      }
    });
  });
  return map;
};

const print = (map) => {
  const keys = [...map.keys()].map((k) => k.split(",").map((n) => +n));
  const leftEdge = Math.min(...keys.map((k) => k[0]));
  const rightEdge = Math.max(...keys.map((k) => k[0]));
  const bottomEdge = Math.max(...keys.map((k) => k[1]));

  const lines = [];
  for (let y = 0; y <= bottomEdge + 1; y += 1) {
    const line = [];
    for (let x = leftEdge - 1; x <= rightEdge + 1; x += 1) {
      const key = `${x},${y}`;
      const value = map.get(key);
      line.push(value ?? " ");
    }
    lines.push(line.join(" "));
  }
  return lines.join("\n");
};

const addSand = (map) => {
  // Find the boundaries of the abyss
  const keys = [...map.keys()].map((k) => k.split(",").map((n) => +n));
  const leftEdge = Math.min(...keys.map((k) => k[0]));
  const rightEdge = Math.max(...keys.map((k) => k[0]));
  const bottomEdge = Math.max(...keys.map((k) => k[1]));

  const abyss = (sandXY) =>
    sandXY[0] < leftEdge || sandXY > rightEdge || sandXY[1] > bottomEdge;

  const sandXY = [500, 0];
  while (true) {
    if (abyss(sandXY)) {
      // Unchanged!
      return map;
    }

    const below = map.get(`${sandXY[0]},${sandXY[1] + 1}`);
    if (below === undefined) {
      // Keep falling downwards
      sandXY[1] += 1;
      continue;
    }

    if (below === SAND || below === ROCK) {
      // Look to the down-left first
      const left = map.has(`${sandXY[0] - 1},${sandXY[1] + 1}`);
      if (!left) {
        sandXY[0] -= 1;
        sandXY[1] += 1;
        continue;
      }

      // Look to the down-right
      const right = map.has(`${sandXY[0] + 1},${sandXY[1] + 1}`);
      if (!right) {
        sandXY[0] += 1;
        sandXY[1] += 1;
        continue;
      }

      // We're stuck! Stop falling.
      break;
    }

    throw new Error("Fell through");
  }

  map.set(sandXY.join(","), SAND);

  if (sandXY[0] === 500 && sandXY[1] === 0) {
    return true;
  }

  return false;
};

const part1 = (map) => {
  for (let i = 0; i < 1000 * 1000; i += 1) {
    const done = addSand(map);
    if (done) {
      return i;
    }
  }
  throw new Error("Overflow");
};

const part2 = (map) => {
  const keys = [...map.keys()];
  const bottomEdge = Math.max(...keys.map((k) => k.split(",")[1]));
  const floor = bottomEdge + 2;

  for (let x = -1000; x < 1000; x += 1) {
    map.set(`${x},${floor}`, ROCK);
  }

  for (let i = 1; i < 1000 * 50; i += 1) {
    const done = addSand(map);
    if (done) {
      return i;
    }
  }

  console.log(print(map));
  throw new Error("Overflow");
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
