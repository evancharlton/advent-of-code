const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const DEBUG = false;

const sortKeys = (a, b) => {
  const [xa, ya] = a.split(",").map((v) => +v);
  const [xb, yb] = b.split(",").map((v) => +v);

  if (yb !== ya) {
    return ya - yb;
  }
  return xa - xb;
};

const parse = (lines) =>
  lines.map((line) =>
    line
      .trim()
      .split("")
      .map((v) => +v)
  );

const createBoard = (data) => {
  const board = {};
  for (let y = 0; y < data.length; y += 1) {
    for (let x = 0; x < data[y].length; x += 1) {
      board[`${x},${y}`] = data[y][x];
    }
  }
  return board;
};

const tick = (current) => {
  const next = {};

  const flasherKeys = [];
  const flashedKeys = new Set();

  if (DEBUG) {
    console.log("===== (current)");
    console.log(printBoard(current));
  }

  // Do a pass over the grid, increment everyone.
  Object.entries(current).forEach(([key, level]) => {
    next[key] = level + 1;
    if (level === 9) {
      flasherKeys.push(key);
    }
  });

  if (DEBUG) {
    console.log("===== (after inc)");
    console.log(printBoard(next));
  }

  // Do more passes and propagate the flashes
  while (flasherKeys.length > 0) {
    const key = flasherKeys.shift();
    if (flashedKeys.has(key)) {
      // console.log(`${key} has already flashed this cycle`);
      continue;
    }
    // console.log(`${key} is flashing`);
    flashedKeys.add(key);
    const [x, y] = key.split(",").map((v) => +v);

    // Increment the neighbors.
    const neighbors = [
      [x, y - 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
      [x, y + 1],
      [x - 1, y + 1],
      [x - 1, y],
      [x - 1, y - 1],
    ]
      .map(([x1, y1]) => `${x1},${y1}`)
      .filter((n) => next[n] !== undefined)
      .sort(sortKeys);

    // console.log(`${key}'s neighbors are: ${neighbors.join(" ")}`);

    neighbors.forEach((neighborKey) => {
      const level = next[neighborKey];
      const nextLevel = level + 1;
      // console.log(`  --> ${neighborKey}: ${level} -> ${nextLevel}`);
      next[neighborKey] = nextLevel;
      if (next[neighborKey] > 9) {
        if (!flasherKeys.includes(neighborKey)) {
          flasherKeys.push(neighborKey);
        }
      }
    });
  }

  if (DEBUG) {
    console.log("===== (after flashing)");
    console.log(printBoard(next));
  }

  // Reset anyone who has flashed.
  Object.entries(next)
    .filter(([_key, level]) => level > 9)
    .forEach(([key]) => {
      // console.log(`Resetting ${key} to 0 after it flashed.`);
      next[key] = 0;
    });

  if (DEBUG) {
    console.log("===== (after resets)");
    console.log(printBoard(next));
  }

  Object.entries(next).forEach(([key, value]) => {
    if (Number.isNaN(value)) {
      throw new Error(`Bad value @ ${key}`);
    }
  });

  const flashes = Object.values(next).filter((v) => v === 0).length;
  if (DEBUG) {
    console.log(`       --> ${flashes} flashes`);
  }

  // console.log([...flashedKeys].sort(sortKeys));

  // if (Object.values(next).filter((v) => v === 0).length !== flashedKeys.size) {
  //   throw new Error(
  //     `${Object.values(next).filter((v) => v === 0).length} !== ${
  //       flashedKeys.size
  //     }`
  //   );
  // }

  return { next, flashes };
};

const printBoard = (board) => {
  const sortedKeys = Object.keys(board).sort(sortKeys);

  return sortedKeys.reduce((output, key, i, keys) => {
    if (i > 0) {
      const [_, y] = key.split(",");
      const [_0, y0] = keys[i - 1].split(",");
      if (y !== y0) {
        output += "\n";
      }
    }
    output += `${board[key]}`;
    return output;
  }, "");
};

const part1 = (data, steps = 100) => {
  const board = createBoard(parse(data));
  let current = board;
  let totalFlashes = 0;
  for (let i = 0; i < steps; i += 1) {
    const { next, flashes } = tick(current);
    totalFlashes += flashes;
    current = next;
  }
  return totalFlashes;
};

const part2 = (data, steps = 1000) => {
  const board = createBoard(parse(data));
  let current = board;
  for (let i = 0; i < steps; i += 1) {
    const { next } = tick(current);
    current = next;
    if (Object.values(next).every((v) => v === 0)) {
      return i + 1;
    }
  }
  return -1;
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  const board = createBoard(parse(data("test-step-30")));
  let current = board;
  let totalFlashes = 0;
  for (let i = 30; i <= 40; i += 1) {
    console.log(`After step ${i}: (taking step # ${i + 1})`);
    console.log(printBoard(current));
    const { next, flashes } = tick(current);
    totalFlashes += flashes;
    console.log(`    Step ${i + 1} complete`);
    console.log(`    --> ${totalFlashes} flashes in total`);
    current = next;
  }
  // console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  // console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  parse,
  createBoard,
  tick,
  printBoard,
};
