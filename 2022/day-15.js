const manhattan = ([x1, y1], [x2, y2]) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

const data = (type = "") => {
  const REGEX =
    /^Sensor at x=(.+), y=(.+): closest beacon is at x=(.+), y=(.+)$/;

  return require("./input")(__filename, "\n", type)
    .filter((line) => REGEX.test(line))
    .map((line) => line.match(REGEX))
    .map(([, sx, sy, bx, by]) => [
      [+sx, +sy],
      [+bx, +by],
      manhattan([sx, sy], [bx, by]),
    ]);
};

const getRowCoverage = (sensorData, row) => {
  // For a given row, find out how much each sensor overlaps that row.
  const overlaps = [];
  sensorData.forEach(([[sx, sy], _, radius]) => {
    const distanceToRow = Math.abs(sy - row);
    if (distanceToRow > radius) {
      return;
    }

    const armLength = radius - distanceToRow;
    const start = sx - armLength;
    const end = sx + armLength;
    if (end < start) {
      throw new Error(`Failed at ${sx},${sy} @ ${row}`);
    }
    overlaps.push([start, end]);
  });

  const sorted = overlaps.sort(([a0, a1], [b0, b1]) => {
    if (a0 !== b0) {
      return a0 - b0;
    }
    return a1 - a0 - (b1 - b0);
  });

  const [working] = sorted;
  for (let i = 0; i < sorted.length; i += 1) {
    const [x0, x1] = sorted[i];
    if (x0 > working[1]) {
      return [x0 - 1, row];
    }
    working[1] = Math.max(x1, working[1]);
  }
  return working[1] - working[0];
};

const part1 = (sensorData, row) => {
  return getRowCoverage(sensorData, row);
};

const part2 = (sensorData, n) => {
  if (!n) {
    throw new Error(`Missing n`);
  }

  for (let i = 0; i < n; i += 1) {
    const found = getRowCoverage(sensorData, i);
    if (Array.isArray(found)) {
      return found[0] * 4000000 + found[1];
    }
  }
  throw new Error("Nope");
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  const args1 = process.argv[2] === "test" ? ["test", 10] : ["", 2000000];
  console.log(`Part 1:`, part1(data(args1[0]), args1[1]));

  const args2 = process.argv[2] === "test" ? ["test", 20] : ["", 4000000];
  console.log(`Part 2:`, part2(data(args2[0]), args2[1]));
}

module.exports = {
  data,
  part1,
  part2,
};
