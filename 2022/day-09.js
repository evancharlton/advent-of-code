const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .filter((line) => Boolean(line))
    .map((line) => {
      const [dir, steps] = line.split(" ");
      return [dir, +steps];
    });
};

const DELTAS = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
};

const print = (knots) => {
  if (!process.env.VERBOSE) {
    return;
  }

  const grid = [];

  for (let row = 0; row < 10; row += 1) {
    grid.push([]);
    for (let col = 0; col < 10; col += 1) {
      grid[row].push(".");
    }
  }

  knots.forEach(([x, y], i) => {
    grid[grid.length - 1 - y][x] = i === 0 ? "H" : i;
  });

  console.debug(grid.map((row) => row.join(" ")).join("\n"));
};

const nextTo = (head, tail) => {
  if (head[0] === tail[0] || head[1] === tail[1]) {
    return true;
  }

  if (Math.abs(head[0] - tail[0]) <= 1 && Math.abs(head[1] - tail[1]) <= 1) {
    return true;
  }

  return false;
};

const takeStep = (direction, num, record, ...startKnots) => {
  const knots = startKnots.map((t) => [...t]);

  print(knots);
  for (let i = 0; i < num; i++) {
    if (!DELTAS[direction]) {
      throw new Error("Unexpected direction: " + direction);
    }

    // Move the head
    const [dx, dy] = DELTAS[direction];
    knots[0][0] += dx;
    knots[0][1] += dy;

    // Then move the tail(s) accordingly.
    tailLoop: for (let t = 1; t < knots.length; t += 1) {
      print(knots);
      const H = knots[t - 1];
      const T = knots[t];

      const diffX = Math.abs(T[0] - H[0]);
      const diffY = Math.abs(T[1] - H[1]);

      if (T[0] === H[0] && T[1] === H[1]) {
        // They're overlapping
        break tailLoop;
      } else if (T[0] === H[0]) {
        // They're on the same column
        const diff = Math.abs(H[1] - T[1]);
        if (diff < 2) {
          break tailLoop;
        }
        T[1] += H[1] > T[1] ? 1 : -1;
      } else if (T[1] === H[1]) {
        // They're on the same row
        const diff = Math.abs(H[0] - T[0]);
        if (diff < 2) {
          break tailLoop;
        }
        T[0] += H[0] > T[0] ? 1 : -1;
      } else {
        // We need to make a diagonal step to get the tail back on the same
        // row/column as the head.
        if (diffX === diffY && diffX === 1) {
          break tailLoop;
        } else if (diffX < diffY) {
          T[0] += H[0] > T[0] ? 1 : -1;
          T[1] += H[1] > T[1] ? 1 : -1;
        } else {
          T[0] += H[0] > T[0] ? 1 : -1;
          T[1] += H[1] > T[1] ? 1 : -1;
        }
      }
    }

    const tail = knots[knots.length - 1];
    record.add(tail.join(","));
  }

  print(knots);

  return knots;
};

const part1 = (steps) => {
  const H = [0, 0];
  const T = [0, 0];

  const positions = new Set();
  positions.add(T.join(","));

  steps.forEach(([direction, num]) => {
    const [newH, newT] = takeStep(direction, num, positions, H, T);

    H[0] = newH[0];
    H[1] = newH[1];
    T[0] = newT[0];
    T[1] = newT[1];
  });

  return positions.size;
};

const part2 = (steps) => {
  const knots = [];
  for (let i = 0; i < 10; i += 1) {
    knots.push([0, 0]);
  }

  const positions = new Set();
  positions.add("0,0");

  steps.forEach(([direction, num]) => {
    const newKnots = takeStep(direction, num, positions, ...knots);
    newKnots.forEach((newKnot, i) => {
      knots[i][0] = newKnot[0];
      knots[i][1] = newKnot[1];
    });
  });

  return positions.size;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  takeStep,
};
