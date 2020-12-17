const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type).map((line) =>
    line.split("")
  );
  return lines;
};

const getNeighbors = (key) => {
  const dimens = key.split(",").map(Number);
  let keys = [];
  while (dimens.length > 0) {
    const current = dimens.shift();
    const additions = [current - 1, current, current + 1];
    if (keys.length === 0) {
      keys = additions.map((add) => String(add));
      continue;
    }

    keys = additions
      .map((add) => {
        return keys.map((key) => {
          if (!key) {
            return String(add);
          }
          return `${key},${add}`;
        });
      })
      .flat();
  }
  return keys;
};

const activeNeighbors = (universe, key) => {
  return getNeighbors(key).reduce((acc, neighbor) => {
    if (neighbor === key) {
      return acc;
    }

    const state = universe[neighbor] || ".";
    if (state !== "#") {
      return acc;
    }
    return acc + 1;
  }, 0);
};

const createUniverse = (lines, dimensions) => {
  const universe = {};
  const pos = new Array(dimensions).fill(0);
  for (let y = 0; y < lines.length; y += 1) {
    for (let x = 0; x < lines[y].length; x += 1) {
      const state = lines[y][x];
      if (state !== "#") {
        continue;
      }
      pos[0] = x;
      pos[1] = y;
      const key = pos.join(",");
      universe[key] = state;
    }
  }
  return universe;
};

const step = (universe) => {
  const nextUniverse = {};
  Object.keys(universe).forEach((key) => {
    const neighbors = activeNeighbors(universe, key);
    if (neighbors === 2 || neighbors === 3) {
      // Stays active
      nextUniverse[key] = "#";
    }

    // Write to my neighbors so that we can look for new life
    getNeighbors(key).forEach((neighbor) => {
      if (neighbor === key) {
        return;
      }

      const state = universe[neighbor];
      if (state !== undefined) {
        return;
      }

      nextUniverse[neighbor] = (nextUniverse[neighbor] || 0) + 1;
    });
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

const evolve = (universe, steps = 6) => {
  let next = universe;
  for (let i = 0; i < steps; i += 1) {
    next = step(next);
  }
  return next;
};

const numActiveCells = (universe) => {
  return Object.keys(universe).length;
};

const part1 = (lines) => {
  const initial = createUniverse(lines, 3);
  const evolved = evolve(initial);
  return numActiveCells(evolved);
};

const part2 = (lines) => {
  const initial = createUniverse(lines, 4);
  const evolved = evolve(initial);
  return numActiveCells(evolved);
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  getNeighbors,
  activeNeighbors,
};
