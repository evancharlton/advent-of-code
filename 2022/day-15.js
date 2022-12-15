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

const part1 = (sensorData, row) => {
  let count = 0;

  const [startX, endX] = sensorData.reduce(
    ([minX, maxX], [[sx], _, dist]) => {
      return [Math.min(minX, sx - dist), Math.max(maxX, sx + dist)];
    },
    [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
  );

  for (x = startX; x <= endX; x++) {
    const coord = [x, row];
    const closeSensors = sensorData.filter(([sensor, beacon, safeRadius]) => {
      if (coord[0] === beacon[0] && coord[1] === beacon[1]) {
        return false;
      }

      const dist = manhattan(sensor, coord);
      return dist <= safeRadius;
    });

    count += closeSensors.length > 0 ? 1 : 0;
  }

  return count;
};

const part1bad = (sensorData, row) => {
  const map = new Map();
  const xRange = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];

  sensorData.forEach(([sensor, beacon]) => {
    const [sx, sy] = sensor;
    const [bx, by] = beacon;
    const dist = manhattan(sensor, beacon);
    console.log(`TCL ~ file: day-15.js:26 ~ sensorData.forEach ~ dist`, dist);

    map.set(`${bx},${by}`, "B");
    map.set(`${sx},${sy}`, "S");

    for (let x = sx - (dist + 1); x <= sx + dist; x++) {
      for (let y = sy - dist; y <= sy + dist; y++) {
        const key = `${x},${y}`;

        if (map.has(key)) continue;
        if (manhattan([x, y], sensor) > dist) continue;

        map.set(key, "#");

        xRange[0] = Math.min(xRange[0], x);
        xRange[1] = Math.max(xRange[1], x);
      }
    }
  });

  let noBeacons = 0;
  const out = [];
  for (let x = xRange[0]; x <= xRange[1]; x++) {
    const value = map.get(`${x},${row}`);
    out.push(map.get(`${x},${row}`) ?? ".");
    if (value === "#") noBeacons++;
  }

  return noBeacons;
};

const part2 = (sensorData, n) => {
  if (!n) {
    throw new Error(`Missing n`);
  }

  for (let y = 0; y <= n; y++) {
    const { gaps } = analyzeRow(sensorData, y, [0, n], true);
    if (gaps.length === 0) {
      continue;
    }

    if (gaps.length !== 1) {
      throw new Error("Too many gaps");
    }

    return gaps[0] * 4000000 + y;
  }

  throw new Error("Nada");
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
