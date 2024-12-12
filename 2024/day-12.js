const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true });
};

const toXy = (x, y) => {
  return `${x},${y}`;
};

const perimeter = (region) => {
  const lookup = region.reduce(
    (acc, { x, y }) => ({ ...acc, [toXy(x, y)]: true }),
    {}
  );

  return region
    .map(
      ({ x, y }) =>
        [
          { x, y: y - 1 },
          { x: x + 1, y },
          { x, y: y + 1 },
          { x: x - 1, y },
        ].filter(({ x: x1, y: y1 }) => lookup[toXy(x1, y1)]).length
    )
    .map((neighborCount) => 4 - neighborCount)
    .reduce((acc, part) => acc + part, 0);
};

const countSides = (region) => {
  const lookup = region.reduce(
    (acc, { x, y }) => ({ ...acc, [toXy(x, y)]: true }),
    {}
  );

  return [
    region
      .filter(({ x, y }) => !lookup[toXy(x, y - 1)])
      .sort(({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
        y1 !== y2 ? y1 - y2 : x1 - x2
      )
      .filter(
        ({ x, y }, i, data) => data[i - 1]?.x !== x - 1 || data[i - 1]?.y !== y
      ).length,
    region
      .filter(({ x, y }) => !lookup[toXy(x + 1, y)])
      .sort(({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
        x1 !== x2 ? x1 - x2 : y1 - y2
      )
      .filter(
        ({ x, y }, i, data) => data[i - 1]?.y !== y - 1 || data[i - 1]?.x !== x
      ).length,
    region
      .filter(({ x, y }) => !lookup[toXy(x, y + 1)])
      .sort(({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
        y1 !== y2 ? y1 - y2 : x1 - x2
      )
      .filter(
        ({ x, y }, i, data) => data[i - 1]?.x !== x - 1 || data[i - 1]?.y !== y
      ).length,
    region
      .filter(({ x, y }) => !lookup[toXy(x - 1, y)])
      .sort(({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
        x1 !== x2 ? x1 - x2 : y1 - y2
      )
      .filter(
        ({ x, y }, i, data) => data[i - 1]?.y !== y - 1 || data[i - 1]?.x !== x
      ).length,
  ].reduce((acc, n) => acc + n, 0);
};

const getRegions = (lines) => {
  const regions = [];
  const taken = new Set();
  const flood = ({ x, y }, seenSet) => {
    const key = toXy(x, y);
    if (seenSet.has(key)) {
      return [];
    }

    seenSet.add(key);
    return [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
    ]
      .filter(({ x: x1, y: y1 }) => {
        return lines[y][x] === lines[y1]?.[x1];
      })
      .map((coords) => {
        return flood(coords, seenSet);
      })
      .flat()
      .concat([{ x, y }]);
  };

  for (let y = 0; y < lines.length; y += 1) {
    const row = lines[y];
    for (let x = 0; x < row.length; x += 1) {
      if (taken.has(`${x},${y}`)) {
        continue;
      }

      // Flood-fill from x,y
      const region = flood({ x, y }, new Set());
      regions.push(region);
      for (const { x: x1, y: y1 } of region) {
        taken.add(toXy(x1, y1));
      }
    }
  }

  return regions;
};

const part1 = (lines) => {
  return getRegions(lines)
    .map((region) => region.length * perimeter(region))
    .reduce((acc, price) => acc + price, 0);
};

const part2 = (lines) => {
  const regions = getRegions(lines);

  return regions
    .map((region) => {
      const sides = countSides(region);
      return region.length * sides;
    })
    .reduce((acc, n) => acc + n, 0);
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  countSides,
  data,
  getRegions,
  part1,
  part2,
};
