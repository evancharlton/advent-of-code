const data = (type = "") => {
  const map = require("./input")(__filename, "\n", type);
  const start = (() => {
    for (let y = 0; y < map.length; y += 1) {
      for (let x = 0; x < map[y].length; x += 1) {
        const letter = map[y][x];
        if (letter === "S") {
          return { x, y };
        }
      }
    }
    throw new Error("No start");
  })();
  return { map, start };
};

const DELTAS = {
  right: {
    x: 1,
    y: 0,
  },
  down: {
    x: 0,
    y: 1,
  },
  left: {
    x: -1,
    y: 0,
  },
  up: {
    x: 0,
    y: -1,
  },
};

const TURNS = {
  right: {
    "-": "right",
    7: "down",
    J: "up",
  },
  down: {
    "|": "down",
    J: "left",
    L: "right",
  },
  left: {
    "-": "left",
    L: "up",
    F: "down",
  },
  up: {
    "|": "up",
    F: "right",
    7: "left",
  },
};

const VECTORS = {
  right: {
    "-": "E",
    7: "SE",
    J: "NE",
  },
  down: {
    "|": "S",
    L: "SE",
    J: "SE",
  },
  left: {
    "-": "W",
    L: "NW",
    F: "SW",
  },
  up: {
    "|": "N",
    7: "NW",
    F: "NE",
  },
};

const followLoop2 = ({ start, map, facing: initialFacing }) => {
  let facing = (() => {
    if (initialFacing) {
      return initialFacing;
    }

    const [above, below, left, right] = [
      map[start.y - 1]?.[start.x],
      map[start.y + 1]?.[start.x],
      map[start.y]?.[start.x - 1],
      map[start.y]?.[start.x + 1],
    ];

    if (right === "-" || right === "7" || right === "J") {
      return "right";
    }
    if (below === "|" || below === "J" || below === "L") {
      return "down";
    }
    if (left === "-" || left === "L" || left === "F") {
      return "left";
    }
    if (above === "|" || above === "F" || above === "7") {
      return "up";
    }
    throw new Error("No idea how to do this");
  })();

  let x = start.x;
  let y = start.y;
  const path = [];
  const vectors = [
    facing === "right"
      ? "E"
      : facing === "down"
      ? "S"
      : facing === "left"
      ? "W"
      : "N",
  ];
  while (path.length < map.length * map[0].length) {
    path.push(`${x},${y}`);

    // Take a step in the current direction
    const { x: dx, y: dy } = DELTAS[facing];
    x += dx;
    y += dy;

    const token = map[y]?.[x];
    if (token === undefined) {
      throw new Error("walked off the map");
    }

    if (token === "S") {
      break;
    }

    const turn = TURNS[facing];
    const next = turn[token];
    if (!next) {
      throw new Error(
        `unknown token: (map[${y}][${x}] = ${token}) + ${facing} -> ${next}`
      );
    }

    const vector = VECTORS[facing][token];
    if (vector === undefined) {
      throw new Error(`No vector for ${facing} / ${token}`);
    }
    vectors.push(vector);

    facing = next;
  }

  return {
    path,
    lookup: path.reduce((acc, xy, i) => ({ ...acc, [xy]: i }), {}),
    vectors,
  };
};

const followLoop = ({ start, map }, track = false) => {
  const [above, below, left, right] = [
    map[start.y - 1]?.[start.x],
    map[start.y + 1]?.[start.x],
    map[start.y]?.[start.x - 1],
    map[start.y]?.[start.x + 1],
  ];
  const firstStep = [
    (above === "|" || above === "7" || above === "F") && { dy: -1, dx: 0 },
    (below === "|" || below === "L" || below === "J") && { dy: 1, dx: 0 },
    (left === "-" || left === "L" || left === "F") && { dy: 0, dx: -1 },
    (right === "-" || right === "7" || right === "J") && { dy: 0, dx: 1 },
  ].filter(Boolean)[0];

  const position = { ...start };
  const delta = { ...firstStep };
  const path = [`${start.x},${start.y}`];
  const lookup = { [`${start.x},${start.y}`]: 0 };
  let steps = 0;
  while (steps++ < map.length * map[0].length) {
    const token = map[position.y][position.x];
    switch (token) {
      case "S": {
        if (steps > 1) {
          return {
            length: steps,
            lookup,
            path,
          };
        }
        break;
      }

      case "|":
      case "-": {
        break;
      }

      case "7": {
        // Came from bottom --> turn left
        if (delta.dy === -1) {
          delta.dy = 0;
          delta.dx = -1;
        } else {
          // Turn right
          delta.dy = 1;
          delta.dx = 0;
        }
        break;
      }

      case "F": {
        // Came from bottom --> turn right
        if (delta.dy === -1) {
          delta.dy = 0;
          delta.dx = 1;
        } else {
          delta.dy = 1;
          delta.dx = 0;
        }
        break;
      }

      case "L": {
        // Came from above --> turn left
        if (delta.dy === 1) {
          delta.dy = 0;
          delta.dx = 1;
        } else {
          delta.dy = -1;
          delta.dx = 0;
        }
        break;
      }

      case "J": {
        // Came from above --> turn right
        if (delta.dy === 1) {
          delta.dy = 0;
          delta.dx = -1;
        } else {
          delta.dy = -1;
          delta.dx = 0;
        }
        break;
      }

      default: {
        throw new Error(`Unknown token: ${token}`);
      }
    }

    position.x += delta.dx;
    position.y += delta.dy;

    if (track) {
      const key = [position.x, position.y].join(",");
      path.push(key);
      if (lookup[key] === undefined) {
        lookup[key] = path.length - 1;
      }
    }
  }
  throw new Error("Check your boundary conditions");
};

const part1 = ({ start, map }) => {
  const { length } = followLoop({ start, map });
  return Math.floor(length / 2);
};

const part2 = ({ start, map }) => {
  const { path, lookup, vectors } = followLoop2({ start, map });

  // console.warn(path.join(" -> "), path.length);
  // console.warn(vectors.join(" -> "), path.length);

  const areas = [];
  for (let y = 1; y < map.length - 1; y += 1) {
    for (let x = 1; x < map[y].length - 1; x += 1) {
      const key = `${x},${y}`;
      const index = lookup[key];
      if (index !== undefined) {
        // This is the pipe loop - we can skip it.
        continue;
      }

      const bounds = (() => {
        return [
          // Walk right as far as we can
          (() => {
            for (let r = x + 1; r < map[y].length; r += 1) {
              if (lookup[`${r},${y}`] !== undefined) {
                return [
                  { x: r, y },
                  {
                    L: "right",
                    F: "down",
                    "|": "down",
                  }[map[y][r]],
                ];
              }
            }
            return undefined;
          })(),
          (() => {
            // Walk down as far as we can
            for (let b = y + 1; b < map.length; b += 1) {
              if (lookup[`${x},${b}`] !== undefined) {
                return [
                  { x, y: b },
                  {
                    7: "left",
                    F: "down",
                    "-": "left",
                  }[map[b][x]],
                ];
              }
            }
            return undefined;
          })(),
          (() => {
            // Walk left as far as we can
            for (let l = x - 1; l >= 0; l -= 1) {
              if (lookup[`${l},${y}`] !== undefined) {
                return [
                  { x: l, y },
                  {
                    7: "left",
                    J: "left",
                    "|": "up",
                  }[map[y][l]],
                ];
              }
            }
            return undefined;
          })(),
          (() => {
            // Walk up as far as we can
            for (let t = y - 1; t >= 0; t -= 1) {
              if (lookup[`${x},${t}`] !== undefined) {
                return [
                  { x, y: t },
                  {
                    L: "right",
                    J: "up",
                    "-": "right",
                  }[map[t][x]],
                ];
              }
            }
            return undefined;
          })(),
        ];
      })();

      if (bounds.some((bound) => !bound)) {
        continue;
      }

      const [[intersection, facing]] = bounds;

      if (!intersection) {
        continue;
      }

      if (facing === undefined) {
        throw new Error(`No facing info`);
      }

      const intersectionIndex = lookup[`${intersection.x},${intersection.y}`];
      const vector = vectors[intersectionIndex];
      const token = map[intersection.y][intersection.x];
      // console.log(
      //   key,
      //   `\t ${intersection.x},${intersection.y} is heading ${vectors[intersectionIndex]}`
      // );
      switch (token) {
        case "|": {
          if (vector === "N") {
            areas.push(key);
          }
          break;
        }
        case "L": {
          if (vector === "NW") {
            areas.push(key);
          }
          break;
        }
        case "F": {
          if (vector === "NE") {
            areas.push(key);
          }
          break;
        }
      }
    }
  }

  return areas;
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
