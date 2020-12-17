const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type).map((line) =>
    line.split("")
  );
  return lines;
};

const k = (x, y, z, w) => `${x},${y},${z},${w}`;
const xyzw = (k) => {
  const [x, y, z, w] = k.split(",").map(Number);
  return { x, y, z, w };
};

const activeNeighbors = (universe, { x: x0, y: y0, z: z0, w: w0 }) => {
  let sum = 0;
  for (let x = x0 - 1; x <= x0 + 1; x += 1) {
    for (let y = y0 - 1; y <= y0 + 1; y += 1) {
      for (let z = z0 - 1; z <= z0 + 1; z += 1) {
        for (let w = w0 - 1; w <= w0 + 1; w += 1) {
          if (x0 === x && y0 === y && z0 === z && w0 === w) continue;
          const state = universe[k(x, y, z, w)] || ".";
          if (state === "#") {
            sum += 1;
          }
        }
      }
    }
  }
  return sum;
};

const createUniverse = (lines) => {
  const universe = {};
  const z = 0;
  const w = 0;
  for (let y = 0; y < lines.length; y += 1) {
    for (let x = 0; x < lines[y].length; x += 1) {
      const state = lines[y][x];
      if (state !== "#") {
        continue;
      }

      universe[k(x, y, z, w)] = state;
    }
  }
  return universe;
};

const step = (universe) => {
  const nextUniverse = {};
  Object.keys(universe).forEach((key) => {
    const { x: x0, y: y0, z: z0, w: w0 } = xyzw(key);
    const neighbors = activeNeighbors(universe, { x: x0, y: y0, z: z0, w: w0 });
    if (neighbors === 2 || neighbors === 3) {
      // Stays active
      nextUniverse[key] = "#";
    }

    // Write to my neighbors so that we can look for new life
    for (let x = x0 - 1; x <= x0 + 1; x += 1) {
      for (let y = y0 - 1; y <= y0 + 1; y += 1) {
        for (let z = z0 - 1; z <= z0 + 1; z += 1) {
          for (let w = w0 - 1; w <= w0 + 1; w += 1) {
            if (x === x0 && y === y0 && z === z0 && w === w0) {
              continue;
            }

            const neighborKey = k(x, y, z, w);
            const neighbor = universe[neighborKey];
            if (neighbor !== undefined) {
              continue;
            }

            nextUniverse[neighborKey] = (nextUniverse[neighborKey] || 0) + 1;
          }
        }
      }
    }
  });

  // Now go through and update the universe with new life
  Object.keys(nextUniverse).forEach((key) => {
    const cell = nextUniverse[key];
    if (cell === "#") {
      // We're done here
      return;
    }

    if (cell === 3) {
      nextUniverse[key] = "#";
      return;
    }

    delete nextUniverse[key];
  });
  return nextUniverse;
};

const part1 = (lines) => {
  let universe = createUniverse(lines);

  for (let i = 0; i < 6; i += 1) {
    universe = step(universe);
  }

  return Object.keys(universe).length;
};

const part2 = (lines) => {
  return undefined;
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
