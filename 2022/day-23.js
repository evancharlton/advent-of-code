const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .filter(Boolean)
    .map((line) => line.split(""));
};

const TESTS = [
  ({ nw, n, ne, x, y }) => !nw & !n && !ne && `${x},${y - 1}`,
  ({ se, s, sw, x, y }) => !se && !s && !sw && `${x},${y + 1}`,
  ({ sw, w, nw, x, y }) => !sw && !w && !nw && `${x - 1},${y}`,
  ({ ne, e, se, x, y }) => !ne && !e && !se && `${x + 1},${y}`,
];
const proposeMove = (round, elves, { x, y }) => {
  const neighbors = {
    nw: elves.get(`${x - 1},${y - 1}`),
    n: elves.get(`${x},${y - 1}`),
    ne: elves.get(`${x + 1},${y - 1}`),
    e: elves.get(`${x + 1},${y}`),
    se: elves.get(`${x + 1},${y + 1}`),
    s: elves.get(`${x},${y + 1}`),
    sw: elves.get(`${x - 1},${y + 1}`),
    w: elves.get(`${x - 1},${y}`),
    x,
    y,
  };

  const { nw, n, ne, e, se, s, sw, w } = neighbors;
  if (!nw && !n && !ne && !e && !se && !s && !sw && !w) {
    return false; // no moving
  }

  for (let testIndex = 0; testIndex < TESTS.length; testIndex += 1) {
    const test = TESTS[(round + testIndex) % TESTS.length];
    const move = test(neighbors);
    if (move) {
      return move;
    }
  }

  return false; // no move
  return `${x},${y}`;
};

const part1 = (grid) => {
  const elves = new Map();

  for (let y = 0; y < grid.length; y += 1) {
    const row = grid[y];
    for (let x = 0; x < row.length; x += 1) {
      const value = row[x];
      if (value === "#") {
        elves.set(`${x},${y}`, { x, y });
      }
    }
  }

  roundsLoop: for (let round = 0; round < 10; round += 1) {
    const proposals = new Map();
    elves.forEach((xyObj, elfId) => {
      const { x, y } = xyObj;

      const moveKey = proposeMove(round, elves, xyObj);
      if (moveKey) {
        proposals.set(moveKey, [...(proposals.get(moveKey) ?? []), elfId]);
      }
    });

    let movedElves = 0;
    proposals.forEach((elfIds, xy) => {
      if (elfIds.length === 1) {
        const [elfId] = elfIds;
        if (xy !== elfId) {
          // console.log(`Round ${round + 1}: Moving ${elfId} -> ${xy}`);
          const [x, y] = xy.split(",").map((v) => +v);
          elves.delete(elfId);
          elves.set(`${x},${y}`, { x, y });
          movedElves += 1;
        }
      }
    });

    // console.log(`Round ${round + 1}: ${movedElves} moved`);

    const bounds = {
      minX: Number.MAX_SAFE_INTEGER,
      maxX: Number.MIN_SAFE_INTEGER,
      minY: Number.MAX_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER,
    };

    for (const pos of elves.keys()) {
      const [x, y] = pos.split(",").map((v) => +v);

      bounds.minX = Math.min(bounds.minX, x);
      bounds.maxX = Math.max(bounds.maxX, x);
      bounds.minY = Math.min(bounds.minY, y);
      bounds.maxY = Math.max(bounds.maxY, y);
    }

    const lines = [];
    for (let y = bounds.minY - 2; y < bounds.maxY + 2; y += 1) {
      const line = [];
      for (let x = bounds.minX - 2; x < bounds.maxX + 2; x += 1) {
        if (elves.has(`${x},${y}`)) {
          line.push("#");
        } else {
          line.push(".");
        }
      }
      lines.push(line.join(" "));
    }

    // console.log(`== End of Round ${round + 1} ==`);
    // console.log(lines.join("\n"));

    if (movedElves === 0) {
      break roundsLoop;
    }
  }

  // Find the bounds

  const bounds = {
    minX: Number.MAX_SAFE_INTEGER,
    maxX: Number.MIN_SAFE_INTEGER,
    minY: Number.MAX_SAFE_INTEGER,
    maxY: Number.MIN_SAFE_INTEGER,
  };

  for (const pos of elves.keys()) {
    const [x, y] = pos.split(",").map((v) => +v);

    bounds.minX = Math.min(bounds.minX, x);
    bounds.maxX = Math.max(bounds.maxX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxY = Math.max(bounds.maxY, y);
  }

  let emptyGround = 0;
  for (let y = bounds.minY; y <= bounds.maxY; y += 1) {
    for (let x = bounds.minX; x <= bounds.maxX; x += 1) {
      if (!elves.has(`${x},${y}`)) {
        emptyGround += 1;
      }
    }
  }
  return emptyGround;
};

const part2 = (grid) => {
  const elves = new Map();

  for (let y = 0; y < grid.length; y += 1) {
    const row = grid[y];
    for (let x = 0; x < row.length; x += 1) {
      const value = row[x];
      if (value === "#") {
        elves.set(`${x},${y}`, { x, y });
      }
    }
  }

  roundsLoop: for (let round = 0; round < 100_000; round += 1) {
    const proposals = new Map();
    elves.forEach((xyObj, elfId) => {
      const { x, y } = xyObj;

      const moveKey = proposeMove(round, elves, xyObj);
      if (moveKey) {
        proposals.set(moveKey, [...(proposals.get(moveKey) ?? []), elfId]);
      }
    });

    let movedElves = 0;
    proposals.forEach((elfIds, xy) => {
      if (elfIds.length === 1) {
        const [elfId] = elfIds;
        if (xy !== elfId) {
          // console.log(`Round ${round + 1}: Moving ${elfId} -> ${xy}`);
          const [x, y] = xy.split(",").map((v) => +v);
          elves.delete(elfId);
          elves.set(`${x},${y}`, { x, y });
          movedElves += 1;
        }
      }
    });

    // console.log(`Round ${round + 1}: ${movedElves} moved`);

    const bounds = {
      minX: Number.MAX_SAFE_INTEGER,
      maxX: Number.MIN_SAFE_INTEGER,
      minY: Number.MAX_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER,
    };

    for (const pos of elves.keys()) {
      const [x, y] = pos.split(",").map((v) => +v);

      bounds.minX = Math.min(bounds.minX, x);
      bounds.maxX = Math.max(bounds.maxX, x);
      bounds.minY = Math.min(bounds.minY, y);
      bounds.maxY = Math.max(bounds.maxY, y);
    }

    const lines = [];
    for (let y = bounds.minY - 2; y < bounds.maxY + 2; y += 1) {
      const line = [];
      for (let x = bounds.minX - 2; x < bounds.maxX + 2; x += 1) {
        if (elves.has(`${x},${y}`)) {
          line.push("#");
        } else {
          line.push(".");
        }
      }
      lines.push(line.join(" "));
    }

    // console.log(`== End of Round ${round + 1} ==`);
    // console.log(lines.join("\n"));

    if (movedElves === 0) {
      return round + 1;
    }
  }
  throw new Error("Uhoh");
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
