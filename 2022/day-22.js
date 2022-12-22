const data = (type = "") => {
  const [map, instructionsLine] = require("./input")(__filename, "\n\n", type);

  return {
    map: map.split("\n").map((line) => line.split("")),
    instructions: instructionsLine.split(/(R|L)/).map((v) => {
      if (Number.isNaN(+v)) {
        return v;
      }
      return +v;
    }),
  };
};

const TURNS = {
  ER: "S",
  SR: "W",
  WR: "N",
  NR: "E",
  EL: "N",
  NL: "W",
  WL: "S",
  SL: "E",
};

const FACING_SCORES = {
  E: 0,
  S: 1,
  W: 2,
  N: 3,
};

const turn = (facing, dir) => {
  return TURNS[`${facing}${dir}`];
};

const advance = (map, [facing, x, y]) => {
  switch (facing) {
    case "E": {
      const row = map[y];
      const x2 = (() => {
        let nextX = x;
        let limit = 200;
        while (limit-- > 0) {
          nextX = (nextX + 1) % row.length;
          const next = row[nextX];
          if (next === "." || next === "#") {
            return nextX;
          }
        }
        throw new Error(`Blew up: ${facing} @ ${x},${y}`);
      })();
      const next = row[x2];
      switch (next) {
        case "#":
          return [x, y];
        case ".":
          return [x2, y];
        default:
          throw new Error(
            `Unknown next cell: ${facing} @ ${x},${y} -> ${x2},${y} => ${next}`
          );
      }
    }

    case "W": {
      const row = map[y];
      const x2 = (() => {
        let nextX = x;
        let limit = 200;
        while (limit-- > 0) {
          nextX = (((nextX - 1) % row.length) + row.length) % row.length;
          const next = row[nextX];
          if (next === "." || next === "#") {
            return nextX;
          }
        }
        throw new Error(`Blew up: ${facing} @ ${x},${y}`);
      })();
      const next = row[x2];
      switch (next) {
        case "#":
          return [x, y];
        case ".":
          return [x2, y];
        default:
          throw new Error(
            `Unknown next cell: ${facing} @ ${x},${y} -> ${x2},${y} => ${next}`
          );
      }
    }

    case "S": {
      const y2 = (() => {
        let nextY = y;
        let limit = 200;
        while (limit-- > 0) {
          nextY = (nextY + 1) % map.length;
          const next = map[nextY][x];
          if (next === "." || next === "#") {
            return nextY;
          }
        }
        throw new Error(`Blew up: ${facing} @ ${x},${y}`);
      })();
      const next = map[y2][x];
      switch (next) {
        case "#":
          return [x, y];
        case ".":
          return [x, y2];
        default:
          throw new Error(
            `Unknown next cell: ${facing} @ ${x},${y} -> ${x},${y2} => ${next}`
          );
      }
    }

    case "N": {
      const y2 = (() => {
        let nextY = y;
        let limit = 200;
        while (limit-- > 0) {
          nextY = (((nextY - 1) % map.length) + map.length) % map.length;
          const next = map[nextY][x];
          if (next === "." || next === "#") {
            return nextY;
          }
        }
        throw new Error(`Blew up: ${facing} @ ${x},${y}`);
      })();
      const next = map[y2][x];
      switch (next) {
        case "#":
          return [x, y];
        case ".":
          return [x, y2];
        default:
          throw new Error(
            `Unknown next cell: ${facing} @ ${x},${y} -> ${x},${y2} => ${next}`
          );
      }
    }

    default: {
      throw new Error(`Unknown advancement: facing ${facing} @ ${x},${y}`);
    }
  }
};

const part1 = ({ map, instructions }) => {
  const facingXY = ["E", map[0].findIndex((v) => v === "."), 0];

  instructions.forEach((ins) => {
    switch (ins) {
      case "R":
      case "L": {
        const before = facingXY[0];
        facingXY[0] = turn(facingXY[0], ins);
        break;
      }
      default: {
        // go forward.
        for (let steps = ins; steps > 0; steps -= 1) {
          const [newX, newY] = advance(map, facingXY);
          if (newX === undefined || newY === undefined) {
            throw new Error("nope");
          }
          facingXY[1] = newX;
          facingXY[2] = newY;
        }
      }
    }
  });

  const [facing, finalX, finalY] = facingXY;
  return (finalY + 1) * 1000 + (finalX + 1) * 4 + FACING_SCORES[facing];
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
