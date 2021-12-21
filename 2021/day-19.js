const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type);
  const scanners = [{}];
  lines.forEach((line) => {
    if (line.startsWith("---")) {
      scanners[scanners.length - 1].name = line
        .replace(/---/g, "")
        .replace(/ /g, "")
        .replace("scanner", "");
    } else if (line.length === 0) {
      scanners.push({});
    } else {
      scanners[scanners.length - 1].data =
        scanners[scanners.length - 1].data ?? [];
      scanners[scanners.length - 1].data.push(line.split(",").map((v) => +v));
    }
  });
  return scanners
    .sort(({ name: a }, { name: b }) => +a - +b)
    .map(({ data, ...rest }) => ({
      ...rest,
      data: data.map(([x, y, z]) => [x ?? 0, y ?? 0, z ?? 0]),
    }));
};

const FLIP_MAP = {
  "Z+": ([x, y, z]) => [-x, y, -z],
  "X-": ([x, y, z]) => [-z, y, x],
  "X+": ([x, y, z]) => [z, y, -x],
  "Y-": ([x, y, z]) => [x, -z, y],
  "Y+": ([x, y, z]) => [x, z, -y],
  "Z-": ([x, y, z]) => [x, y, z],
};

const FLIPS = Object.keys(FLIP_MAP);

const ROTATION_MAP = {
  0: ([x, y, z]) => [x, y, z],
  90: ([x, y, z]) => [y, -x, z],
  180: ([x, y, z]) => [-x, -y, z],
  270: ([x, y, z]) => [-y, x, z],
};

const ROTATIONS = Object.keys(ROTATION_MAP);

const getCompleteMap = (scans) => {
  const queue = [...scans];
  const { data: referenceScan } = queue.shift();
  const knownMap = createMap(referenceScan);
  const knownVectors = getVectors(knownMap);
  const scannerPositions = {
    1: "0,0,0",
  };

  const n = queue.length;
  let limit = (n * (n + 1)) / 2;
  queueLoop: while (queue.length > 0) {
    if (limit-- === 0) {
      console.error("Check your bounds");
      process.exit(1);
    }
    const record = queue.shift();
    const { name, data: trialBeacons } = record;

    console.log(
      `Processing data from scanner ${name} ... (${queue.length} records left)`
    );

    const threshold = Math.min(11, trialBeacons.length);

    const knownBeaconIds = Object.keys(knownMap);

    flipLoop: for (let f = 0; f < FLIPS.length; f += 1) {
      const flip = FLIP_MAP[FLIPS[f]];
      rotationLoop: for (let r = 0; r < ROTATIONS.length; r += 1) {
        const rot = ROTATION_MAP[ROTATIONS[r]];
        const transformedBeacons = trialBeacons.map((beacon) =>
          flip(rot(beacon))
        );

        const trialMap = createMap(transformedBeacons);
        const trialVectors = getVectors(trialMap);

        // Find the number of possible candidates
        const candidateMagnitudes = Object.keys(trialVectors).filter(
          (magnitude) => !!knownVectors[magnitude]
        );
        if (candidateMagnitudes < threshold) {
          continue rotationLoop;
        }

        const trialBeaconIds = Object.keys(trialMap);

        // We have a suspicious number of candidates. Let's start randomly
        // sliding the window to see if more things match up.
        knownLoop: for (
          let knownBeaconI = 0;
          knownBeaconI < knownBeaconIds.length;
          knownBeaconI += 1
        ) {
          const [knownX, knownY, knownZ] = toXyz(knownBeaconIds[knownBeaconI]);
          trialLoop: for (
            let trialBeaconI = 0;
            trialBeaconI < trialBeaconIds.length;
            trialBeaconI += 1
          ) {
            const [trialX, trialY, trialZ] = toXyz(
              trialBeaconIds[trialBeaconI]
            );

            const [diffX, diffY, diffZ] = [
              trialX - knownX,
              trialY - knownY,
              trialZ - knownZ,
            ];

            const slidBeaconIds = transformedBeacons
              .map(([x, y, z]) => {
                const after = [x - diffX, y - diffY, z - diffZ];
                return after;
              })
              .map(toKey);

            const overlappingIds = slidBeaconIds.filter((id) => !!knownMap[id]);

            if (overlappingIds.length < threshold) {
              // All this means is that perhaps *that one* beacon isn't a shared
              // beacon. We have to try them all.
              continue trialLoop;
            }

            // Great, we found a match. Add 'em to the map!
            slidBeaconIds.forEach((id) => {
              knownMap[id] = (knownMap[id] ?? 0) + 1;
            });

            // Record where the scanners are.
            scannerPositions[name] = toKey([diffX, diffY, diffZ]);

            // And move on to the next scan set.
            continue queueLoop;
          }
        }
      }
    }
    queue.push(record);
  }
  return { beacons: knownMap, scanners: scannerPositions };
};

const toXyz = (key) => key.split(",").map((v) => +v);
const toKey = (xyz) => xyz.join(",");

const getVectors = (beaconMap) => {
  const beaconDistances = {};
  const knownBeaconIds = Object.keys(beaconMap);
  knownBeaconIds.forEach((beaconId) => {
    const myPosition = toXyz(beaconId);
    const [myX, myY, myZ] = myPosition;
    knownBeaconIds.forEach((otherBeaconId) => {
      if (otherBeaconId === beaconId) {
        return;
      }

      const theirPosition = toXyz(otherBeaconId);
      const [theirX, theirY, theirZ] = theirPosition;

      // Compute the manhattan distance between them.
      const distance =
        Math.abs(myX - theirX) +
        Math.abs(myY - theirY) +
        Math.abs(myZ - theirZ);

      // We want to order the two beacons. We don't have any information other
      // than coordinates, in a coordinate grid that we don't know. However, we
      // know a few things:
      //  1. A source of truth (the origin grid)
      //  2. There are a finite number of orientation (24)
      // With this, we could always find a match (if one exists) by simply
      // running it 24 times.
      //
      // For a stable selection, we're going to go with a vector which aims to
      // go from:
      //  1. left-to-right
      //  2. bottom-to-top
      //  3. in-to-out (w.r.t the page)

      let from;
      let to;
      if (myX < theirX) {
        from = myPosition;
        to = theirPosition;
      } else if (myX > theirX) {
        from = theirPosition;
        to = myPosition;
      } else if (myX === theirX) {
        if (myY < theirY) {
          from = myPosition;
          to = theirPosition;
        } else if (myX > theirX) {
          from = theirPosition;
          to = myPosition;
        } else if (myX === theirX) {
          if (myZ < theirZ) {
            from = myPosition;
            to = theirPosition;
          } else if (myZ > theirZ) {
            from = theirPosition;
            to = myPosition;
          } else if (myZ === theirZ) {
            // This shouldn't matter; it'd be a zero-magnitude vector.
            from = myPosition;
            to = theirPosition;
          }
        }
      }

      // Record this in the map for lookup later.
      beaconDistances[distance] = beaconDistances[distance] ?? new Set();
      beaconDistances[distance].add(
        toKey([to[0] - from[0], to[1] - from[1], to[2] - from[2]])
      );
    });
  });
  return beaconDistances;
};

const createMap = (beacons) => {
  return beacons.reduce((acc, xyz) => ({ ...acc, [toKey(xyz)]: 1 }), {});
};

const part1 = (scans) => {
  const { beacons } = getCompleteMap(scans);
  return Object.keys(beacons).length;
};

const part2 = (scans) => {
  const { scanners } = getCompleteMap(scans);

  const scannerIds = Object.keys(scanners);
  let maximumDistance = 0;
  for (let a = 0; a < scannerIds.length; a += 1) {
    for (let b = 0; b < scannerIds.length; b += 1) {
      if (a === b) {
        continue;
      }

      const [ax, ay, az] = toXyz(scanners[scannerIds[a]]);
      const [bx, by, bz] = toXyz(scanners[scannerIds[b]]);
      maximumDistance = Math.max(
        maximumDistance,
        Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz)
      );
    }
  }
  return maximumDistance;
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
