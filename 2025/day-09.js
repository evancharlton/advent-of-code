const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map((line) =>
    line.split(",").map((v) => +v)
  );
};

const part1 = (tiles) => {
  let biggest = 0;
  for (let a = 0; a < tiles.length - 1; a += 1) {
    for (let b = a + 1; b < tiles.length; b += 1) {
      if (a === b) continue;

      const [x, y] = tiles[a];
      const [n, m] = tiles[b];

      const area = (Math.abs(n - x) + 1) * (Math.abs(m - y) + 1);
      biggest = Math.max(area, biggest);
    }
  }

  return biggest;
};

const part2 = (redTiles) => {
  const tiles = new Map();
  for (let i = 0; i < redTiles.length; i += 1) {
    const red = redTiles[i];
    const nextRed = redTiles[(i + 1) % redTiles.length];
    tiles.set(`${red[0]},${red[1]}`, "#");

    for (
      let x = Math.min(red[0], nextRed[0]);
      x <= Math.max(red[0], nextRed[0]);
      x += 1
    ) {
      for (
        let y = Math.min(red[1], nextRed[1]);
        y <= Math.max(red[1], nextRed[1]);
        y += 1
      ) {
        const key = `${x},${y}`;
        if (!tiles.has(key)) {
          tiles.set(key, "X");
        }
      }
    }
  }

  for (let a = 0; a < redTiles.length - 1; a += 1) {
    for (let b = a + 1; b < redTiles.length; b += 1) {
      const [x, y] = redTiles[a];
      const [n, m] = redTiles[b];
      const [o, p] = [x, m];
      const [q, r] = [n, y];

      // Now validate that all four corners are within the bounds
    }
  }

  const [x0, x1, y0, y1] = redTiles.reduce(
    ([x0, x1, y0, y1], [x, y]) => [
      Math.min(x0, x),
      Math.max(x1, x),
      Math.min(y0, y),
      Math.max(y1, y),
    ],
    [
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ]
  );

  const verticalEdges = [];
  for (let i = 0; i < redTiles.length; i += 1) {
    const current = redTiles[i];
    const next = redTiles[(i + 1) % redTiles.length];

    if (current[0] !== next[0]) {
      continue;
    }

    verticalEdges.push([
      current[0],
      Math.min(current[1], next[1]),
      Math.max(current[1], next[1]),
    ]);
  }

  verticalEdges.sort(([a], [b]) => a - b);

  const verticalEdgeLookup = new Map();
  verticalEdges.forEach((edge) => {
    for (let v = edge[1]; v <= edge[2]; v += 1) {
      if (!verticalEdgeLookup.has(v)) {
        verticalEdgeLookup.set(v, []);
      }
      verticalEdgeLookup.get(v).push(edge);
    }
  });

  const isInside = (x, y) => {
    if (tiles.has(`${x},${y}`)) {
      return true;
    }

    let crossings = 0;
    for (const [x1, y0, y1] of verticalEdgeLookup.get(y) ?? []) {
      if (x1 <= x && y0 <= y && y1 > y) {
        crossings += 1;
      }
    }

    return crossings % 2 === 1;
  };

  let biggest = 0;
  for (let a = 0; a < redTiles.length - 1; a += 1) {
    rectLoop: for (let b = a + 1; b < redTiles.length; b += 1) {
      const [x, y] = redTiles[a];
      const [n, m] = redTiles[b];

      const area = (Math.abs(n - x) + 1) * (Math.abs(m - y) + 1);
      if (area <= biggest) continue; // don't even bother

      // Check the horizontal edges and make sure every pixel is within
      for (let v = Math.min(y, m); v <= Math.max(y, m); v += 1) {
        if (!isInside(x, v) || !isInside(n, v)) continue rectLoop;
      }

      // And the vertical edges
      for (let h = Math.min(x, n); h <= Math.max(x, n); h += 1) {
        if (!isInside(h, y) || !isInside(h, m)) continue rectLoop;
      }

      biggest = Math.max(area, biggest);
    }
  }

  return biggest;
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
