const DELTAS = {
  // step: [dx, dy, dz]
  e: [1, -1, 0],
  w: [-1, 1, 0],
  nw: [0, 1, -1],
  se: [0, -1, 1],
  sw: [-1, 0, 1],
  ne: [1, 0, -1],
};

const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map(getSteps);
};

const xyz = (...xyz) => xyz.join(",");
const zyx = (xyz) => xyz.split(",").map(Number);

const getSteps = (path) => {
  const steps = [];
  for (let i = 0; i < path.length; i += 1) {
    let step = path[i];
    if (step === "e" || step === "w") {
      steps.push(step);
      continue;
    }
    if (step === "n" || step === "s") {
      i += 1;
      step += path[i];
      steps.push(step);
      continue;
    }
  }
  return steps;
};

const getId = (steps) => {
  const position = [0, 0, 0];
  steps.forEach((step) => {
    const [dx, dy, dz] = DELTAS[step];
    position[0] += dx;
    position[1] += dy;
    position[2] += dz;
  });
  return xyz(...position);
};

const getNeighbors = (id) => {
  const [x, y, z] = zyx(id);
  return Object.values(DELTAS)
    .map(([dx, dy, dz]) => [x + dx, y + dy, z + dz])
    .map((coords) => coords.join(","));
};

const createBoard = (instructions) => {
  const board = new Set();
  instructions.forEach((steps) => {
    const id = getId(steps);
    if (board.has(id)) {
      board.delete(id);
    } else {
      board.add(id);
    }
  });
  return board;
};

const part1 = (instructions) => {
  return part2(instructions, 0);
};

const part2 = (instructions, turns) => {
  let board = createBoard(instructions);

  let turn = 0;
  while (turn++ < turns) {
    const next = new Map();
    board.forEach((id) => {
      const neighborIds = getNeighbors(id);
      const blackTileNeighbors = neighborIds.filter((neighborId) =>
        board.has(neighborId)
      ).length;
      if (blackTileNeighbors === 0 || blackTileNeighbors > 2) {
        next.set(id, 3);
      } else {
        // Set a marker to ensure that we can make this black later on.
        next.set(id, -10);
      }

      neighborIds.forEach((neighborId) => {
        const count = next.get(neighborId) || 0;
        next.set(neighborId, count + 1);
      });
    });

    // Prune it down to tiles with exactly 2 neighbors .. or ones we know are
    // supposed to be black?
    board.clear();
    next.forEach((count, neighborId) => {
      if (count < 0 || count === 2) {
        board.add(neighborId);
      }
    });
  }

  return board.size;
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  DELTAS,
  data,
  part1,
  part2,
  getSteps,
  getId,
  getNeighbors,
};
