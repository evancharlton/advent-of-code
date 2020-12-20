const data = (type = "") => {
  return require("./input")(__filename, "\n\n", type)
    .map((tileBlock) => {
      const [header, ...lines] = tileBlock.split("\n");
      const id = header.replace("Tile ", "").replace(":", "");
      return {
        id: +id,
        lines,
      };
    })
    .reduce((acc, { id, lines }) => ({ ...acc, [id]: lines }), {});
};

const findNeighbors = (input) => {
  const fingerprinted = Object.entries(input)
    .map(([id, lines]) => {
      const north = lines[0];
      const south = lines[lines.length - 1];
      const [west, east] = lines.reduce(
        ([w, e], line) => {
          const start = line[0];
          const end = line[line.length - 1];
          return [w + start, e + end];
        },
        ["", ""]
      );
      const edges = [north, south, east, west];
      const flips = [
        north.split("").reverse().join(""),
        south.split("").reverse().join(""),
        east.split("").reverse().join(""),
        west.split("").reverse().join(""),
      ];
      return {
        id,
        edges,
        flips,
      };
    })
    .reduce((acc, { id, edges, flips }) => {
      const next = { ...acc };
      edges.forEach((edge) => {
        next[edge] = [...(next[edge] || []), id];
      });
      flips.forEach((flip) => {
        next[flip] = [...(next[flip] || []), id];
      });
      return next;
    }, {});

  const neighbored = Object.entries(fingerprinted).reduce(
    (acc, [edge, [first, second]]) => {
      if (!second) {
        return acc;
      }

      const next = { ...acc };
      next[first] = next[first] || new Set();
      next[second] = next[second] || new Set();

      next[first].add(second);
      next[second].add(first);

      return next;
    },
    {}
  );

  return neighbored;
};

const part1 = (input) => {
  const corners = Object.entries(findNeighbors(input))
    .filter(([id, neighbors]) => neighbors.size === 2)
    .map(([id]) => id)
    .reduce((acc, id) => acc * id, 1);
  return corners;
};

const getEdge = (tile, edge) => {
  switch (edge) {
    case "n":
      return tile[0];
    case "s":
      return tile[tile.length - 1];
    case "w":
      return tile.map((line) => line[0]).join("");
    case "e":
      return tile.map((line) => line[line.length - 1]).join("");
  }
};

const doTilesMatch = (a, edgeA, b, edgeB) => {
  return getEdge(a, edgeA) === getEdge(b, edgeB);
};

const tilesFit = (a, b) => {
  if (doTilesMatch(a, "n", b, "s")) {
    return { ab: "north", ba: "south" };
  }
  if (doTilesMatch(a, "s", b, "n")) {
    return { ab: "south", ba: "north" };
  }
  if (doTilesMatch(a, "e", b, "w")) {
    return { ab: "east", ba: "west" };
  }
  if (doTilesMatch(a, "w", b, "e")) {
    return { ab: "west", ba: "east" };
  }
  return { ab: undefined, ba: undefined };
};

const flipTile = (tile) => {
  return tile.slice().reverse();
};

const rotateTile = (tile) => {
  const out = [];

  for (let column = 0; column < tile[0].length; column += 1) {
    let line = "";
    for (let row = tile.length - 1; row >= 0; row -= 1) {
      line += tile[row][column];
    }
    out.push(line);
  }

  return out;
};

const createMap = (input) => {
  const neighborhoodLookup = findNeighbors(input);
  const completed = new Set();

  const [[referenceId]] = Object.entries(neighborhoodLookup).filter(
    ([id, neighbors]) => neighbors.size === 2
  );

  const pictureTiles = {};

  const tileIdQueue = [referenceId];
  pictureTiles[referenceId] = {
    id: referenceId,
    tile: input[referenceId],
    north: undefined,
    south: undefined,
    east: undefined,
    west: undefined,
  };
  let limit = 0;
  while (limit++ <= 1000 && tileIdQueue.length > 0) {
    const referenceId = tileIdQueue.shift();
    if (completed.has(referenceId)) {
      continue;
    }
    const { tile: referenceTile } = pictureTiles[referenceId];
    const referenceNeighborsSet = neighborhoodLookup[referenceId];
    [...referenceNeighborsSet].forEach((neighborId) => {
      let tileBeingTested = input[neighborId];
      outer: for (let f = 0; f < 2; f += 1) {
        for (let r = 0; r < 4; r += 1) {
          const { ab, ba } = tilesFit(referenceTile, tileBeingTested);
          if (ab && ba) {
            // Create the record for the newly-discovered tile placement
            pictureTiles[neighborId] = {
              id: neighborId,
              tile: tileBeingTested,
              north: undefined,
              south: undefined,
              east: undefined,
              west: undefined,
              ...pictureTiles[neighborId],
              [ba]: referenceId,
            };
            pictureTiles[referenceId][ab] = neighborId;
            tileIdQueue.push(neighborId);
            break outer;
          }
          tileBeingTested = rotateTile(tileBeingTested);
        }
        tileBeingTested = flipTile(tileBeingTested);
      }
    });
    completed.add(referenceId);
  }

  return pictureTiles;
};

const createPicture = (input) => {
  const map = createMap(input);
  const grid = [];

  const topRow = Object.entries(map)
    .filter(([id, { north }]) => north === undefined)
    .reduce((row, [id, info]) => ({ ...row, [id]: info }), {});
  let row = topRow;

  while (Object.keys(row).length > 0) {
    let gridRow = [];
    const [[start]] = Object.entries(row).filter(([id, { west }]) => !west);
    let current = row[start];
    while (current) {
      gridRow.push(current.id);
      current = map[current.east];
    }
    grid.push(gridRow);
    row = Object.entries(map)
      .filter(([id, { north }]) => north === start)
      .reduce((acc, [id, info]) => ({ ...acc, [id]: info }), {});
  }

  let picture = [];

  grid.forEach((row, j) => {
    row.forEach((tileId) => {
      const { tile } = map[tileId];
      tile.slice(1, -1).forEach((line, i) => {
        const offset = j * 8 + i;
        picture[offset] =
          (picture[offset] || "") + line.split("").slice(1, -1).join("");
      });
    });
  });

  return picture;
};

const MONSTER = `
                  # 
#    ##    ##    ###
 #  #  #  #  #  #   
`
  .split("\n")
  .filter(Boolean);

const getBoxes = (pixelsIn) => {
  const pixels = JSON.parse(JSON.stringify(pixelsIn));
  const out = [];
  for (let y = 0; y < pixels.length - MONSTER.length; y += 1) {
    const rows = [pixels[y], pixels[y + 1], pixels[y + 2]];
    for (let x = 0; x < pixels[y].length - MONSTER[0].length; x += 1) {
      out.push(rows.map((row, i) => row.substr(x, MONSTER[i].length)));
    }
  }
  return out;
};

const findBoxesWithMonsters = (boxes) =>
  boxes.filter((box) => {
    for (let y = 0; y < box.length; y += 1) {
      for (let x = 0; x < box[y].length; x += 1) {
        if (MONSTER[y][x] === "#") {
          const pixel = box[y][x];
          if (pixel !== "#") {
            return false;
          }
        }
      }
    }
    return true;
  });

const findMonsters = (pixels) => {
  const boxes = getBoxes(pixels);
  return findBoxesWithMonsters(boxes);
};

const findCorrectOrientation = (pixels) => {
  for (let f = 0; f < 2; f += 1) {
    for (let r = 0; r < 4; r += 1) {
      const monsters = findMonsters(pixels);
      if (monsters.length) {
        return { pixels, monsters };
      }
      pixels = rotateTile(pixels);
    }
    pixels = flipTile(pixels);
  }
  throw new Error("Could not find any monsters");
};

const getMonsterCount = (input) => {
  const pixels = createPicture(input);

  // I have no idea if this picture is in the right orientation.
  // However, we know that there's a sea monster in it somewhere.
  // Therefore, flip & rotate until we find sea monsters!
  const { pixels: correct, monsters } = findCorrectOrientation(pixels);
  return { pixels: correct, monsters: monsters.length };
};

const part2 = (input) => {
  const { pixels, monsters } = getMonsterCount(input);

  const noise = pixels
    .join("")
    .split("")
    .filter((c) => c === "#").length;
  const monsterPixels = monsters * MONSTER.join("").replace(/[^#]/g, "").length;

  return noise - monsterPixels;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  MONSTER,
  findBoxesWithMonsters,
  getMonsterCount,
  rotateTile,
  part1,
  part2,
};
