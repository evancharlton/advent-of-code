const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .filter((line) => !!line)
    .map((line) => line.split(",").map((v) => +v));
};

const part1 = (cubes) => {
  const lookup = new Map();
  cubes.forEach((cube) => {
    lookup.set(cube.join(","), true);
  });

  const has = (...args) => {
    const key = args.join(",");
    return lookup.has(key);
  };

  const cubesWithNeighbors = cubes.reduce((acc, [x, y, z]) => {
    let out = acc;
    for (const v of [-1, 1]) {
      out += has(x + v, y, z) ? 1 : 0;
      out += has(x, y + v, z) ? 1 : 0;
      out += has(x, y, z + v) ? 1 : 0;
    }
    return out;
  }, 0);
  if (cubesWithNeighbors % 2 !== 0) {
    throw new Error("A weird number of cubes report neighbors");
  }

  return cubes.length * 6 - cubesWithNeighbors;
};

const sortXYZ = ([ax, ay, az], [bx, by, bz]) => ax - bx || ay - by || az - bz;
const sortXZY = ([ax, ay, az], [bx, by, bz]) => ax - bx || az - bz || ay - by;
const sortYZX = ([ax, ay, az], [bx, by, bz]) => ay - by || az - bz || ax - bx;

const reportGaps = (gaps) => (arr) => {
  if (arr.length === 1) {
    return;
  }

  const start = arr[0];
  const end = arr[arr.length - 1];
  const set = new Set(arr);

  for (let n = start; n <= end; n += 1) {
    if (!set.has(n)) {
      gaps.add(n);
    }
  }
};

const part2 = (cubes) => {
  const lookup = new Map();
  cubes.forEach((cube) => {
    lookup.set(cube.join(","), {
      a: 1,
      b: 1,
      c: 1,
      d: 1,
      e: 1,
      f: 1,
    });
  });

  const has = (...args) => {
    const key = args.join(",");
    return lookup.has(key);
  };

  cubes.forEach(([x, y, z]) => {
    const key = [x, y, z].join(",");
    let { a, b, c, d, e, f } = lookup.get(key);
    if (has(x + 1, y, z)) b = 0;
    if (has(x - 1, y, z)) e = 0;
    if (has(x, y + 1, z)) c = 0;
    if (has(x, y - 1, z)) f = 0;
    if (has(x, y, z + 1)) d = 0;
    if (has(x, y, z - 1)) a = 0;

    lookup.set(key, { a, b, c, d, e, f });
  });

  // Choose a cube and start walking. Let's just hope that we get an exterior
  // face to start with?
  const visited = new Set();
};

const part2wrong = (cubes) => {
  const lookup = new Map();
  cubes.forEach((cube) => {
    lookup.set(cube.join(","), true);
  });

  const has = (...args) => {
    const key = args.join(",");
    return lookup.has(key);
  };

  const pairsXY = new Map();
  const pairsXZ = new Map();
  const pairsYZ = new Map();
  cubes.forEach(([x, y, z]) => {
    pairsXY.set(
      `${x},${y}`,
      [...(pairsXY.get(`${x},${y}`) ?? []), z].sort((a, b) => a - b)
    );
    pairsXZ.set(
      `${x},${z}`,
      [...(pairsXZ.get(`${x},${z}`) ?? []), y].sort((a, b) => a - b)
    );
    pairsYZ.set(
      `${y},${z}`,
      [...(pairsYZ.get(`${y},${z}`) ?? []), x].sort((a, b) => a - b)
    );
  });

  const gaps = { x: new Set(), y: new Set(), z: new Set() };

  pairsXY.forEach(reportGaps(gaps.z));
  pairsXZ.forEach(reportGaps(gaps.y));
  pairsYZ.forEach(reportGaps(gaps.x));

  // Create a list of all possible x,y,z sets
  const { x, y, z } = gaps;
  const missing = new Set();
  x.forEach((gapX) => {
    y.forEach((gapY) => {
      z.forEach((gapZ) => {
        if (!has(gapX, gapY, gapZ)) {
          missing.add(`${gapX},${gapY},${gapZ}`);
        }
      });
    });
  });

  const innerCubes = [...missing].map((xyz) => xyz.split(",").map((v) => +v));

  return part1([...cubes, ...innerCubes]);
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
