const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line, id) => {
    const [x, y] = line.split(", ").map(Number);
    return { id: String.fromCharCode("a".charCodeAt(0) + id), x, y };
  });
};

const getDistances = (x, y, inputs) => {
  return inputs.map(({ id, x: otherX, y: otherY }) => {
    return { id, distance: Math.abs(otherX - x) + Math.abs(otherY - y) };
  });
};

const getClosest = (x, y, inputs) => {
  const [closest, second] = getDistances(x, y, inputs).sort(
    ({ distance: a }, { distance: b }) => a - b
  );

  if (closest.distance === second.distance) {
    return ".";
  }
  return closest.id;
};

const getBounds = (input) => {
  return input.reduce(
    ([minX, maxX, minY, maxY], { x, y }) => {
      return [
        Math.min(minX, x),
        Math.max(maxX, x),
        Math.min(minY, y),
        Math.max(maxY, y),
      ];
    },
    [
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ]
  );
};

const part1 = (input) => {
  const [minX, maxX, minY, maxY] = getBounds(input);

  const coords = new Map();
  const infiniteIds = new Set();
  for (let y = minY - 1; y <= maxY; y += 1) {
    for (let x = minX - 1; x <= maxX; x += 1) {
      const cellId = `${y},${x}`;
      const closest = getClosest(x, y, input);
      coords.set(cellId, closest);
      if (y === minY - 1 || y === maxY || x === minX - 1 || x === maxX) {
        infiniteIds.add(closest);
      }
    }
  }

  const finiteAreas = new Map();
  coords.forEach((closest) => {
    if (infiniteIds.has(closest) || closest === ".") {
      return;
    }
    finiteAreas.set(closest, (finiteAreas.get(closest) || 0) + 1);
  });

  let largestSize = 0;
  finiteAreas.forEach((size) => {
    largestSize = Math.max(size, largestSize);
  });

  return largestSize;
};

const part2 = (input, threshold = 10000) => {
  const [minX, maxX, minY, maxY] = getBounds(input);

  const map = new Map();
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const cellId = `${y},${x}`;
      const totalDistance = getDistances(x, y, input)
        .map(({ distance }) => distance)
        .reduce((acc, v) => acc + v);
      map.set(cellId, totalDistance);
    }
  }

  const safeCellIds = new Set();
  map.forEach((distance, cellId) => {
    if (distance < threshold) {
      safeCellIds.add(cellId);
    }
  });

  return safeCellIds.size;
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
