const data = (type = "") => {
  const line = require("./input")(__filename, "\n", type)[0].replace(
    "target area: ",
    ""
  );
  const [x, y] = line.split(", ").map((s) =>
    s
      .replace(/[xy]=/, "")
      .split("..")
      .map((v) => +v)
  );
  return {
    x: { min: x[0], max: x[1] },
    y: { min: y[0], max: y[1] },
  };
};

const step = (position, velocity) => {
  let nextX = velocity.x;
  if (nextX > 0) {
    nextX -= 1;
  } else if (nextX < 0) {
    nextX += 1;
  } else {
    nextX = 0;
  }
  return {
    position: {
      x: position.x + velocity.x,
      y: position.y + velocity.y,
    },
    velocity: {
      x: nextX,
      y: velocity.y - 1,
    },
  };
};

const simulate = (target, initialVelocity) => {
  const { x: xBounds, y: yBounds } = target;
  let position = { x: 0, y: 0 };
  let velocity = { ...initialVelocity };
  let steps = 0;
  let maxY = Number.MIN_SAFE_INTEGER;
  let sanity = 1000000;
  const positions = [position];
  while (true) {
    if (sanity-- === 0) {
      console.error(target, initialVelocity, position, velocity, steps);
      throw new Error(`Check your bounds`);
    }
    const { position: nextPosition, velocity: nextVelocity } = step(
      position,
      velocity
    );
    positions.push(nextPosition);
    steps += 1;
    // console.log(
    //   position,
    //   "->",
    //   nextPosition,
    //   "/",
    //   velocity,
    //   "->",
    //   nextVelocity
    // );

    position = nextPosition;
    velocity = nextVelocity;

    maxY = Math.max(maxY, position.y);

    if (velocity.x === 0 && position.x < xBounds.min) {
      // We have no hope of making it there.
      return null;
    }

    if (position.x > xBounds.max) {
      // We overshot.
      return null;
    }

    if (position.y < yBounds.min) {
      // We overshot (vertically).
      return null;
    }

    if (position.x >= xBounds.min && position.y <= yBounds.max) {
      // console.log(
      //   `TCL ~ file: day-17.js ~ line 54 ~ simulate ~ ${position.x} >= ${xBounds.min} && ${position.y} <= ${yBounds.max}`
      // );
      // // We're in the quadrant, but did we overshoot?
      // console.log(
      //   `TCL ~ file: day-17.js ~ line 59 ~ simulate ~ ${position.x} > ${xBounds.max} || ${position.y} < ${yBounds.min}`
      // );
      // We're in the target area.
      return {
        position,
        velocity,
        steps,
        maxY,
        v0: initialVelocity,
        positions,
      };
    }
  }
};

const part1 = (target) => {
  let maximumY = 0;
  let bestSim = null;
  // I don't know how ot math out these limits, so I just guess-and-checked
  // until the result stabilized.
  for (let vX = 1; vX < 100; vX += 1) {
    for (let vY = target.y.min; vY < 100; vY += 1) {
      const initialV = { x: vX, y: vY };
      const simulation = simulate(target, initialV);
      if (!simulation) {
        continue;
      }

      if (simulation.maxY > maximumY) {
        bestSim = simulation;
        maximumY = simulation.maxY;
        // console.log(simulation, `is the winner so far @ ${maximumY}`);
      } else {
        // console.log(
        //   initialV,
        //   `is good, but not good enough @ ${simulation.maxY}`
        // );
      }
    }
  }

  return maximumY;
};

const part2 = (target) => {
  const valid = new Set();
  // I don't know how ot math out these limits, so I just guess-and-checked
  // until the result stabilized.
  for (let vX = 1; vX < 1000; vX += 1) {
    for (let vY = target.y.min; vY < 100; vY += 1) {
      const initialV = { x: vX, y: vY };
      const simulation = simulate(target, initialV);
      if (!simulation) {
        continue;
      }

      valid.add(`${vX},${vY}`);
    }
  }

  return valid.size;
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
};
