const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map((line) =>
    line.split(",").map((v) => +v)
  );
};

const part1 = (boxes, limit = 1000) => {
  const distanceBetween = ([x, y, z], [a, b, c]) =>
    Math.sqrt(Math.pow(a - x, 2) + Math.pow(b - y, 2) + Math.pow(c - z, 2));

  const pairs = [];
  for (let aI = 0; aI < boxes.length; aI += 1) {
    for (let bI = 0; bI < boxes.length; bI += 1) {
      if (bI === aI) continue;

      const a = boxes[aI];
      const b = boxes[bI];

      pairs.push([a.join(","), b.join(","), distanceBetween(a, b)]);
    }
  }

  const closestPairs = pairs
    .sort((a, b) => a[2] - b[2])
    .filter((_, i) => i % 2 === 0)
    .slice(0, limit);

  const circuits = [];
  const circuitLookup = new Map(); // <xyz, circuitIndex>

  for (const [a, b] of closestPairs) {
    const aCircuitID = circuitLookup.get(a);
    const bCircuitID = circuitLookup.get(b);

    if (aCircuitID === undefined && bCircuitID === undefined) {
      // Neither node is on a circuit - create a new one
      const id = circuits.length;
      circuits.push([a, b]);
      circuitLookup.set(a, id);
      circuitLookup.set(b, id);
    } else if (aCircuitID === undefined) {
      // Merge A into B's circuit
      circuits[bCircuitID].push(a);
      circuitLookup.set(a, bCircuitID);
    } else if (bCircuitID === undefined) {
      // Merge B into A's circuit
      circuits[aCircuitID].push(b);
      circuitLookup.set(b, aCircuitID);
    } else if (aCircuitID === bCircuitID) {
      // Do nothing; they're on the same circuit
    } else if (aCircuitID !== bCircuitID) {
      // Separate circuits! Merge B's peers into A's circuit
      const bNetwork = circuits[bCircuitID];
      for (const peer of bNetwork) {
        circuitLookup.set(peer, aCircuitID);
      }
      circuits[aCircuitID].push(...bNetwork);
      bNetwork.length = 0;
    } else {
      throw new Error("We're off the rails here");
    }
  }

  return circuits
    .sort((a, b) => b.length - a.length)
    .slice(0, 3)
    .reduce((acc, c) => acc * c.length, 1);
};

const part2 = () => {
  return undefined;
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
