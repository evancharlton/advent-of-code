const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((path) =>
    getSteps(path)
  );
};

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

const print = (tile = this) => {
  return [
    `#${tile.id} (${tile.color})`,
    SIDES.map((side) => {
      return `\t${side} => ${tile[side] !== undefined ? tile[side] : "<>"}`;
    }),
  ]
    .flat()
    .join("\n");
};

const FLIPS = {
  black: "white",
  white: "black",
};

const MIRROR_STEPS = {
  e: "w",
  w: "e",
  se: "nw",
  nw: "se",
  sw: "ne",
  ne: "sw",
};

const SIDES = ["e", "se", "sw", "w", "nw", "ne"];

const createHive = () => {
  let globalId = 0;
  const hive = new Map();

  const createTile = () => {
    const created = {
      id: globalId++,
      color: "white",
      toString: function () {
        return print(this);
      },
    };
    hive.set(created.id, created);
    return created;
  };

  const surround = (tileId) => {
    const tile = hive.get(tileId);

    // Create new tiles as necessary
    SIDES.forEach((side) => {
      if (tile[side] === undefined) {
        const created = createTile();
        tile[side] = created.id;
        created[MIRROR_STEPS[side]] = tile.id;
      }
    });

    const neighborIds = SIDES.map((side) => tile[side]);
    const neighbors = neighborIds.map((id) => hive.get(id));

    if (neighbors.some((n) => !n)) {
      console.warn(neighbors);
      console.warn(tile.toString());
      throw new Error("Missing neighbors");
    }

    const [e, se, sw, w, nw, ne] = neighbors;

    // Now link them all up

    e.sw = se.id;
    e.nw = ne.id;

    se.ne = e.id;
    se.w = sw.id;

    sw.e = se.id;
    sw.nw = w.id;

    w.se = sw.id;
    w.ne = nw.id;

    nw.sw = w.id;
    nw.e = ne.id;

    ne.w = nw.id;
    ne.se = e.id;

    return tile;
  };

  const start = createTile();
  const edgeIds = [start.id];

  for (let i = 0; i < 100; i += 1) {
    const addedIds = new Set();
    while (edgeIds.length) {
      const edgeTileId = edgeIds.shift();
      const surroundedTile = surround(edgeTileId);
      SIDES.forEach((side) => {
        addedIds.add(surroundedTile[side]);
      });
    }
    edgeIds.push(...addedIds);
  }

  return hive;
};

const createLayout = (paths) => {
  const hive = createHive();

  // Create the initial layout
  paths.forEach((steps, i) => {
    let current = hive.get(0);
    steps.forEach((step, j) => {
      current = hive.get(current[step]);
      if (!current) {
        console.warn(`Path #${i}, step #${j}`);
        throw new Error("Walked off the hive!");
      }
    });
    current.color = FLIPS[current.color];
  });

  return hive;
};

const countBlackTiles = (hive) => {
  let blackTiles = 0;
  hive.forEach(({ color }) => {
    if (color === "black") {
      blackTiles += 1;
    }
  });
  return blackTiles;
};

const part1 = (paths) => {
  const hive = createLayout(paths);
  return countBlackTiles(hive);
};

const part2 = (paths, days = 100) => {
  const hive = createLayout(paths);

  for (let i = 0; i < days; i += 1) {
    const changes = new Map();
    hive.forEach((tile, id) => {
      const neighbors = SIDES.map((side) => tile[side]).map(
        (neighborId) => hive.get(neighborId) || { color: "white" }
      );
      const blackTileNeighbors = neighbors.filter(
        ({ color }) => color === "black"
      ).length;
      const { color: tileColor } = tile;
      if (tileColor === "black") {
        if (blackTileNeighbors === 0 || blackTileNeighbors > 2) {
          changes.set(id, "white");
        }
      } else {
        if (blackTileNeighbors === 2) {
          changes.set(id, "black");
        }
      }
    });

    // Perform the changes
    changes.forEach((newColor, id) => {
      hive.get(id).color = newColor;
    });
  }

  return countBlackTiles(hive);
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
