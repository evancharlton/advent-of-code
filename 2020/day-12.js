const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type);
  return lines.map((line) => {
    const [action, ...values] = line;
    const value = +values.join("");
    return { action, value };
  });
};

const advance = ({ action, value }) => {
  switch (action) {
    case "N": // North
      return { x: 0, y: value };
    case "S": // South
      return { x: 0, y: -value };
    case "E": // East
      return { x: value, y: 0 };
    case "W": // West
      return { x: -value, y: 0 };
    default:
      throw new Error(`Unrecognized movement: ${action}`);
  }
};

const turn = ({ value }, start) => {
  // Map the direction back to a number.
  const facing = directionToAngle(start);
  const newAngle = facing + value;
  return angleToDirection(newAngle);
};

const directionToAngle = (d) => {
  const angle = {
    E: 0,
    S: 90,
    W: 180,
    N: 270,
  }[d];
  if (angle === undefined) {
    throw new Error(`Unknown direction: ${d}`);
  }
  return angle;
};

const angleToDirection = (v) => {
  const direction = {
    [0]: "E",
    [90]: "S",
    [180]: "W",
    [270]: "N",
  }[(v + 360) % 360];
  if (direction === undefined) {
    throw new Error(`Unknown rotation: ${v}`);
  }
  return direction;
};

const part1 = (actions) => {
  const ship = {
    x: 0,
    y: 0,
    d: "E",
  };

  actions.forEach(({ action, value }) => {
    switch (action) {
      case "N":
      case "E":
      case "S":
      case "W": {
        const { x, y } = advance({ action, value });
        ship.x += x;
        ship.y += y;
        break;
      }

      case "F": {
        const { x, y } = advance({ action: ship.d, value });
        ship.x += x;
        ship.y += y;
        break;
      }

      case "R": {
        // Rotate
        ship.d = turn({ value }, ship.d);
        break;
      }
      case "L": {
        ship.d = turn({ value: -value }, ship.d);
        break;
      }
    }
  });

  return Math.abs(ship.x) + Math.abs(ship.y);
};

const MUTATORS = {
  [0]: (w) => w,
  [90]: ({ x, y }) => ({ x: y, y: -x }),
  [180]: ({ x, y }) => ({ x: -x, y: -y }),
  [270]: ({ x, y }) => ({ x: -y, y: x }),
};

const rotate = ({ action, value }, { x, y }) => {
  switch (action) {
    case "R": {
      return MUTATORS[value]({ x, y });
    }

    case "L":
      return rotate({ action: "R", value: (-value + 360) % 360 }, { x, y });

    default:
      throw new Error(`Unknown rotation: ${action}`);
  }
};

const part2 = (actions) => {
  const waypoint = {
    x: 10,
    y: 1,
  };

  const ship = {
    x: 0,
    y: 0,
    d: "E",
  };

  actions.forEach(({ action, value }) => {
    switch (action) {
      case "N":
      case "E":
      case "S":
      case "W": {
        const { x, y } = advance({ action, value });
        waypoint.x += x;
        waypoint.y += y;
        break;
      }

      case "F": {
        ship.x += waypoint.x * value;
        ship.y += waypoint.y * value;
        break;
      }

      case "R":
      case "L": {
        const { x, y } = rotate({ action, value }, waypoint);
        waypoint.x = x;
        waypoint.y = y;
        break;
      }
    }
  });

  return Math.abs(ship.x) + Math.abs(ship.y);
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
