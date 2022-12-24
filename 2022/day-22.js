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

const score = (row, column, facing) =>
  (row + 1) * 1000 + (column + 1) * 4 + FACING_SCORES[facing];

const part1 = ({ map, instructions }) => {
  const facingXY = ["E", map[0].findIndex((v) => v === "."), 0];

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
  return score(finalY, finalX, facing);
};

const toString = ({ face, facing, x, y }) => `${face} @ ${x},${y} (${facing})`;

const isInfo = (v) => v === "." || v === "#";

const parseFaces = (lines) => {
  const faces = [lines.length < 4 * 6];
  if (lines.length < 100) {
    const side = 4;
    faces.push(
      lines.slice(side * 0, side * 1).map((line) => line.filter(isInfo))
    );

    // 2 3 4
    const middle = lines.slice(side * 1, side * 2);
    faces.push(middle.map((line) => line.slice(side * 0, side * 1)));
    faces.push(middle.map((line) => line.slice(side * 1, side * 2)));
    faces.push(middle.map((line) => line.slice(side * 2, side * 3)));

    // 5 6
    const end = lines
      .slice(side * 2, side * 3)
      .map((line) => line.filter(isInfo));
    faces.push(end.map((line) => line.slice(side * 0, side * 1)));
    faces.push(end.map((line) => line.slice(side * 1, side * 2)));
  } else {
    const side = 50;
    const top = lines.slice(side * 0, side * 1);
    faces.push(top.map((line) => line.slice(side * 1, side * 2)));
    faces.push(top.map((line) => line.slice(side * 2, side * 3)));

    const middle = lines.slice(side * 1, side * 2);
    faces.push(middle.map((line) => line.slice(side * 1, side * 2)));

    const third = lines.slice(side * 2, side * 3);
    faces.push(third.map((line) => line.slice(side * 0, side * 1)));
    faces.push(third.map((line) => line.slice(side * 1, side * 2)));

    const bottom = lines.slice(side * 3, side * 4);
    faces.push(bottom);
  }
  return faces;
};

const nextXY = ({ x, y, facing }) => {
  switch (facing) {
    case "E":
      return [x + 1, y];
    case "W":
      return [x - 1, y];
    case "N":
      return [x, y - 1];
    case "S":
      return [x, y + 1];
    default:
      throw new Error(`Unrecognized orientation: ${facing}`);
  }
};

const createFace =
  (getCell, side) =>
  ({ east, west, north, south }) => {
    return (ins, startCoords) => {
      if (ins === "R" || ins === "L") {
        return {
          ...startCoords,
          facing: TURNS[`${startCoords.facing}${ins}`],
        };
      }

      let coords = startCoords;
      for (let steps = 0; steps < ins; steps += 1) {
        const [nextX, nextY] = nextXY(coords);

        let nextCoords;
        if (nextX < 0) {
          nextCoords = west({ x: nextX, y: nextY, N: side });
        } else if (nextX >= side) {
          nextCoords = east({ x: nextX, y: nextY, N: side });
        } else if (nextY < 0) {
          nextCoords = north({ x: nextX, y: nextY, N: side });
        } else if (nextY >= side) {
          nextCoords = south({ x: nextX, y: nextY, N: side });
        } else {
          nextCoords = { ...coords, x: nextX, y: nextY, N: side };
        }

        // Try to take the step
        const cell = getCell(nextCoords);
        if (cell === "#") {
          break;
        } else if (cell === ".") {
          coords = nextCoords;
        } else {
          console.error(nextCoords);
          throw new Error(`Unknown next cell: ${cell}`);
        }
      }
      return coords;
    };
  };

const linkFaces = (faceMaps, getCell) => {
  const faces = [
    () => {
      throw new Error("This is just a placeholder");
    },
  ];

  const [isSampleData] = faceMaps;
  const creator = createFace(getCell, isSampleData ? 4 : 50);

  if (isSampleData) {
    faces.push(
      creator({
        east: ({ y, N }) => ({ face: 3, facing: "S", x: N - 1, y }),
        west: ({ y, N }) => ({ face: 6, facing: "W", x: N - 1, y: N - y }),
        north: ({ x, N }) => ({ face: 2, facing: "S", x: N - x, y: 0 }),
        south: ({ x }) => ({ face: 4, facing: "S", x, y: 0 }),
      })
    );
    // 2
    faces.push(
      creator({
        east: ({ y }) => ({ face: 3, facing: "E", x: 0, y }),
        west: ({ y, N }) => ({ face: 6, facing: "N", x: N - 1 - y, y: N - 1 }),
        north: ({ x, N }) => ({ face: 1, facing: "S", x: N - 1 - x, y: 0 }),
        south: ({ x, N }) => ({ face: 5, facing: "N", x: N - 1 - x, y: N - 1 }),
      })
    );
    // 3
    faces.push(
      creator({
        east: ({ y }) => ({ face: 4, facing: "E", x: 0, y }),
        west: ({ y, N }) => ({ face: 2, facing: "W", x: N - 1, y }),
        north: ({ x }) => ({ face: 1, facing: "E", x: 0, y: x }),
        south: ({ x, N }) => ({ face: 5, facing: "E", x: 0, y: N - 1 - x }),
      })
    );
    // 4
    faces.push(
      creator({
        east: ({ y, N }) => ({ face: 6, facing: "S", x: N - 1 - y, y: 0 }),
        west: ({ y, N }) => ({ face: 3, facing: "W", x: N - 1, y }),
        north: ({ x, N }) => ({ face: 1, facing: "N", x, y: N - 1 }),
        south: ({ x }) => ({ face: 5, facing: "S", x, y: 0 }),
      })
    );
    // 5
    faces.push(
      creator({
        east: ({ y }) => ({ face: 6, facing: "E", x: 0, y: y }),
        west: ({ y, N }) => ({ face: 3, facing: "N", x: y, y: N - 1 }),
        north: ({ x, N }) => ({ face: 4, facing: "N", x, y: N - 1 }),
        south: ({ x, N }) => ({ face: 2, facing: "N", x: N - 1 - x, y: N - 1 }),
      })
    );
    // 6
    faces.push(
      creator({
        east: ({ y, N }) => ({ face: 1, facing: "W", x: N - 1, y: N - 1 - y }),
        west: ({ y, N }) => ({ face: 5, facing: "W", x: N - 1, y }),
        north: ({ x, N }) => ({ face: 4, facing: "W", x: N - 1, y: N - 1 - x }),
        south: ({ x, N }) => ({ face: 2, facing: "E", x: 0, y: N - 1 - x }),
      })
    );
  } else {
    // 1
    faces.push(
      creator({
        east: ({ y }) => ({ face: 2, facing: "E", x: 0, y }),
        west: ({ y, N }) => ({ face: 4, facing: "E", x: 0, y: N - 1 - y }),
        south: ({ x }) => ({ face: 3, facing: "S", x, y: 0 }),
        north: ({ x }) => ({ face: 6, facing: "E", x: 0, y: x }),
      })
    );
    // 2
    faces.push(
      creator({
        east: ({ y, N }) => ({ face: 5, facing: "W", x: N - 1, y: N - 1 - y }),
        west: ({ y, N }) => ({ face: 1, facing: "W", x: N - 1, y }),
        south: ({ x, N }) => ({ face: 3, facing: "W", x: N - 1, y: x }),
        north: ({ x, N }) => ({ face: 6, facing: "N", x, y: N - 1 }),
      })
    );
    // 3
    faces.push(
      creator({
        east: ({ y, N }) => ({ face: 2, facing: "N", x: y, y: N - 1 }),
        west: ({ y }) => ({ face: 4, facing: "S", x: y, y: 0 }),
        south: ({ x }) => ({ face: 5, facing: "S", x, y: 0 }),
        north: ({ x, N }) => ({ face: 1, facing: "N", x, y: N - 1 }),
      })
    );
    // 4
    faces.push(
      creator({
        east: ({ y }) => ({ face: 5, facing: "E", x: 0, y }),
        west: ({ y, N }) => ({ face: 1, facing: "E", x: 0, y: N - 1 - y }),
        south: ({ x }) => ({ face: 6, facing: "S", x, y: 0 }),
        north: ({ x }) => ({ face: 3, facing: "E", x: 0, y: x }),
      })
    );
    // 5
    faces.push(
      creator({
        east: ({ y, N }) => ({ face: 2, facing: "W", x: N - 1, y: N - 1 - y }),
        west: ({ y, N }) => ({ face: 4, facing: "W", x: N - 1, y }),
        south: ({ x, N }) => ({ face: 6, facing: "W", x: N - 1, y: x }),
        north: ({ x, N }) => ({ face: 3, facing: "N", x, y: N - 1 }),
      })
    );
    // 6 - suspect
    faces.push(
      creator({
        east: ({ y, N }) => ({ face: 5, facing: "N", x: y, y: N - 1 }),
        west: ({ y, N }) => ({ face: 1, facing: "S", x: y, y: 0 }),
        south: ({ x, N }) => ({ face: 2, facing: "S", x: x, y: 0 }),
        north: ({ x, N }) => ({ face: 4, facing: "N", x, y: N - 1 }),
      })
    );
  }
  return faces;
};

const toMapXY = (isSampleData, { face, x, y }) => {
  if (isSampleData) {
    const side = 4;
    switch (face) {
      case 1:
        return [x + side * 2, y];
      case 2:
        return [x, y + side];
      case 3:
        return [x + side, y + side];
      case 4:
        return [x + side * 2, y + side];
      case 5:
        return [x + side * 2, y + side * 2];
      case 6:
        return [x + side * 3, y + side * 2];
      default:
        throw new Error("Bad data");
    }
  } else {
    const side = 50;
    switch (face) {
      case 1:
        return [x + side, y];
      case 2:
        return [x + side * 2, y];
      case 3:
        return [x + side, y + side];
      case 4:
        return [x, y + side * 2];
      case 5:
        return [x + side, y + side * 2];
      case 6:
        return [x, y + side * 3];
      default:
        throw new Error("Bad data");
    }
  }
};

const part2 = ({ map, instructions }) => {
  const FACE_MAPS = parseFaces(map);
  const FACES = linkFaces(FACE_MAPS, ({ face, x, y }) => {
    try {
      return FACE_MAPS[face][y][x];
    } catch (e) {
      console.warn(`Failed @ FACES[${face}][${y}][${x}]`);
      throw e;
    }
  });

  let coords = {
    face: 0b1,
    x: 0,
    y: 0,
    facing: "E",
  };

  while (instructions.length > 0) {
    const { face } = coords;
    const ins = instructions.shift();
    const nextCoords = FACES[face](ins, coords);
    coords = nextCoords;
  }

  const [finalX, finalY] = toMapXY(FACE_MAPS[0], coords);

  return score(finalY, finalX, coords.facing);
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
