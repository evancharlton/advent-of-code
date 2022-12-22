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

const advanceGrid = (map, [facing, x, y]) => {
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
          return [facing, x, y];
        case ".":
          return [facing, x2, y];
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
          return [facing, x, y];
        case ".":
          return [facing, x2, y];
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
          return [facing, x, y];
        case ".":
          return [facing, x, y2];
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
          return [facing, x, y];
        case ".":
          return [facing, x, y2];
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

const walk = ({ map, instructions, step, startXY }) => {
  const facingXY = ["E", ...startXY];

  instructions.forEach((ins) => {
    switch (ins) {
      case "R":
      case "L": {
        facingXY[0] = turn(facingXY[0], ins);
        break;
      }
      default: {
        // go forward.
        for (let steps = ins; steps > 0; steps -= 1) {
          const [newFacing, newX, newY] = step(map, facingXY);
          if (newX === undefined || newY === undefined) {
            throw new Error("nope");
          }
          facingXY[0] = newFacing;
          facingXY[1] = newX;
          facingXY[2] = newY;
        }
      }
    }
  });

  const [facing, finalX, finalY] = facingXY;
  return (finalY + 1) * 1000 + (finalX + 1) * 4 + FACING_SCORES[facing];
};

const part1 = ({ map, instructions }) => {
  return walk({
    map,
    instructions,
    step: advanceGrid,
    startXY: [map[0].findIndex((v) => v === "."), 0],
  });
};

const parseFaces = (map) => {
  const isExample = map.length < 50;
  const sideLength = isExample ? 4 : 50;
  const faces = new Array(6);
  faces[0] = [];
  faces[1] = [];
  faces[2] = [];
  faces[3] = [];
  faces[4] = [];
  faces[5] = [];

  const transforms = new Array(6);
  const nextFaceIndex = new Array(6);
  const enterFunctions = new Array(6);

  let convertXY;

  if (isExample) {
    // face 1
    for (let y = 0; y < sideLength; y += 1) {
      const row = map[y].filter((v) => v !== " ");
      faces[0].push(row);
    }

    // faces 2, 3, 4
    for (let y = sideLength; y < sideLength * 2; y += 1) {
      faces[1].push(map[y].slice(sideLength * 0, sideLength * 1));
      faces[2].push(map[y].slice(sideLength * 1, sideLength * 2));
      faces[3].push(map[y].slice(sideLength * 2));
    }

    // faces 5, 6
    for (let y = sideLength * 2; y < map.length; y += 1) {
      const row = map[y].filter((v) => v !== " ");
      faces[4].push(row.slice(sideLength * 0, sideLength * 1));
      faces[5].push(row.slice(sideLength * 1));
    }

    enterFunctions.push(([facing, faceX, faceY]) => {
      switch (facing) {
        case "E": // Came from 2
      }
    });

    transforms[0] = {
      E: "W",
      S: "S",
      W: "S",
      N: "S",
    };
    transforms[1] = {
      E: "E",
      S: "N",
      W: "N",
      N: "S",
    };
    transforms[2] = {
      E: "E",
      S: "E",
      W: "W",
      N: "E",
    };
    transforms[3] = {
      E: "S",
      S: "S",
      W: "W",
      N: "N",
    };
    transforms[4] = {
      E: "E",
      S: "N",
      W: "N",
      N: "N",
    };
    transforms[5] = {
      E: "W",
      S: "E",
      W: "W",
      N: "W",
    };

    nextFaceIndex[0] = {
      E: 5,
      S: 3,
      W: 2,
      N: 1,
    };

    nextFaceIndex[1] = {
      E: 2,
      S: 4,
      W: 5,
      N: 0,
    };

    nextFaceIndex[2] = {
      E: 3,
      S: 4,
      W: 1,
      N: 0,
    };

    nextFaceIndex[3] = {
      E: 5,
      S: 4,
      W: 2,
      N: 0,
    };

    nextFaceIndex[4] = {
      E: 5,
      S: 1,
      W: 2,
      N: 3,
    };

    nextFaceIndex[5] = {
      E: 0,
      S: 1,
      W: 4,
      N: 3,
    };

    convertXY = ({ mapXY, faceXY, faceIndex }) => {
      if (mapXY) {
        // From map coords to face coords
        const [mapX, mapY] = mapXY;
        return [mapX % sideLength, mapY % sideLength];
      } else if (faceXY && faceIndex !== undefined) {
        const [faceX, faceY] = faceXY;
        switch (faceIndex) {
          case 0:
            return [faceX + sideLength * 2, faceY];
          case 1:
            return [faceX, sideLength + faceY];
          case 2:
            return [faceX + sideLength, sideLength + faceY];
          case 3:
            return [faceX + sideLength * 2, sideLength + faceY];
          case 4:
            return [faceX + sideLength * 2, sideLength * 2 + faceY];
          case 5:
            return [faceX + sideLength * 3, sideLength * 2 + faceY];
          default:
            throw new Error(`Unknown faceIndex: ${faceIndex}`);
        }
      } else {
        throw new Error("Bad parameters");
      }
    };
  } else {
    // faces 1, 2
    for (let y = 0; y < sideLength; y += 1) {
      const row = map[y].filter((v) => v !== " ");
      faces[0].push(row.slice(sideLength * 0, sideLength * 1));
      faces[1].push(row.slice(sideLength * 1));
    }

    // face 3
    for (let y = sideLength; y < sideLength * 2; y += 1) {
      const row = map[y].filter((v) => v !== " ");
      faces[2].push(row);
    }

    // faces 4, 5
    for (let y = sideLength * 2; y < sideLength * 3; y += 1) {
      faces[3].push(map[y].slice(sideLength * 0, sideLength * 1));
      faces[4].push(map[y].slice(sideLength * 1));
    }

    // face 6
    for (let y = sideLength * 3; y < map.length; y += 1) {
      faces[5].push(map[y]);
    }

    transforms[0] = {
      E: "E",
      S: "S",
      W: "E",
      N: "E",
    };
    transforms[1] = {
      E: "W",
      S: "W",
      W: "W",
      N: "N",
    };
    transforms[2] = {
      E: "N",
      S: "S",
      W: "S",
      N: "N",
    };
    transforms[3] = {
      E: "W",
      S: "S",
      W: "E",
      N: "E",
    };
    transforms[4] = {
      E: "W",
      S: "W",
      W: "W",
      N: "N",
    };
    transforms[5] = {
      E: "N",
      S: "S",
      W: "S",
      N: "N",
    };

    nextFaceIndex[0] = {
      E: 1,
      S: 2,
      W: 3,
      N: 5,
    };

    nextFaceIndex[1] = {
      E: 4,
      S: 2,
      W: 0,
      N: 5,
    };

    nextFaceIndex[2] = {
      E: 1,
      S: 4,
      W: 3,
      N: 0,
    };

    nextFaceIndex[3] = {
      E: 4,
      S: 5,
      W: 0,
      N: 2,
    };

    nextFaceIndex[4] = {
      E: 1,
      S: 5,
      W: 3,
      N: 2,
    };

    nextFaceIndex[5] = {
      E: 4,
      S: 1,
      W: 0,
      N: 3,
    };

    convertXY = ({ mapXY, faceXY, faceIndex }) => {
      if (mapXY) {
        // From map coords to face coords
        const [mapX, mapY] = mapXY;
        return [mapX % sideLength, mapY % sideLength];
      } else if (faceXY && faceIndex !== undefined) {
        const [faceX, faceY] = faceXY;
        switch (faceIndex) {
          case 0:
            return [faceX + sideLength, faceY];
          case 1:
            return [faceX + sideLength * 2 + faceY];
          case 2:
            return [faceX + sideLength, sideLength + faceY];
          case 3:
            return [faceX, sideLength * 2 + faceY];
          case 4:
            return [faceX + sideLength, sideLength * 2 + faceY];
          case 5:
            return [faceX, sideLength * 3 + faceY];
          default:
            throw new Error(`Unknown faceIndex: ${faceIndex}`);
        }
      } else {
        throw new Error("Bad parameters");
      }
    };
  }

  return [faces, transforms, nextFaceIndex, convertXY];
};

const part2 = ({ map, instructions }) => {
  const [faces, transforms, nextFaceIndex, convertXY] = parseFaces(map);

  let currentFaceIndex = 0;
  const advanceCube = (_, [facing, ...mapXY]) => {
    const [faceX, faceY] = convertXY({ mapXY });

    const face = faces[currentFaceIndex];
    const nextCell = (() => {
      switch (facing) {
        case "E": {
          if (faceX === face[faceY].length) {
            // We'll walk off the edge of the cube.
            // Get the next face and peek at that.
            const nextFace = faces[nextFaceIndex[facing]];
            return nextFace[0][faceY];
          }
        }
      }
    })();

    return [facing, ...mapXY];
  };

  return walk({ map, instructions, step: advanceCube, startXY: [0, 0] });
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
