const data = (type = "") => {
  return require("./input")(__filename, "\n", type).filter((line) =>
    Boolean(line)
  );
};

const DELTAS = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
};

const makeStepper =
  (record) =>
  (instruction, ...startKnots) => {
    const [direction, num] = instruction.split(" ");

    const knots = startKnots.map((t) => [...t]);

    for (let i = 0; i < +num; i++) {
      if (!DELTAS[direction]) {
        throw new Error("Unexpected direction: " + direction);
      }

      // Move the head
      const [dx, dy] = DELTAS[direction];
      knots[0][0] += dx;
      knots[0][1] += dy;

      // Then move the tail(s) accordingly.
      tailLoop: for (let t = 1; t < knots.length; t += 1) {
        const H = knots[t - 1];
        const T = knots[t];

        if (T[0] === H[0] && T[1] === H[1]) {
          // They're overlapping
          break tailLoop;
        } else if (T[0] === H[0]) {
          // They're on the same column
          const diff = Math.abs(H[1] - T[1]);
          if (diff === 1) {
            break tailLoop;
          }
          T[1] += H[1] > T[1] ? 1 : -1;
        } else if (T[1] === H[1]) {
          // They're on the same row
          const diff = Math.abs(H[0] - T[0]);
          if (diff === 1) {
            break tailLoop;
          }
          T[0] += H[0] > T[0] ? 1 : -1;
        } else {
          // We need to make a diagonal step to get the tail back on the same
          // row/column as the head.
          const diffX = Math.abs(T[0] - H[0]);
          const diffY = Math.abs(T[1] - H[1]);

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

    return knots;
  };

const part1 = (steps) => {
  const H = [0, 0];
  const T = [0, 0];

  const positions = new Set();
  positions.add(T.join(","));

  const takeStep = makeStepper(positions);

  steps.forEach((instruction) => {
    const [newH, newT] = takeStep(instruction, H, T);

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

  const takeStep = makeStepper(positions);

  steps.forEach((instruction) => {
    const newKnots = takeStep(instruction, ...knots);
    newKnots.forEach((newKnot, i) => {
      knots[i] = newKnot;
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
  makeStepper,
};
