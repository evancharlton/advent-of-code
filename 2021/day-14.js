const data = (type = "") => {
  const [polymer, insertions] = require("./input")(__filename, "\n\n", type);
  return {
    polymer: polymer.split(""),
    insertions: insertions
      .split("\n")
      .map((line) => line.split(" -> "))
      .reduce((acc, [pair, insertion]) => ({ ...acc, [pair]: insertion }), {}),
  };
};

const getPairs = (polymer) => {
  const pairs = {};
  for (let position = 0; position < polymer.length - 1; position += 1) {
    const current = polymer[position];
    const next = polymer[position + 1];
    const pair = [current, next].join("");
    pairs[pair] = (pairs[pair] ?? 0) + 1;
  }
  return pairs;
};

const insert = (current, insertions) => {
  return Object.entries(current).reduce(
    (acc, [pair, count]) => {
      const insertion = insertions[pair];
      if (!insertion) {
        throw new Error("I thought every pair had a replacement?");
      }

      const first = `${pair[0]}${insertion}`;
      acc[first] = (acc[first] ?? 0) + count;

      const second = `${insertion}${pair[1]}`;
      acc[second] = (acc[second] ?? 0) + count;

      return acc;
    },
    // Everything gets destroyed so we have a whole new universe after.
    {}
  );
};

const countElements = (current, polymer) => {
  // Get the element counts
  const counts = Object.entries(current).reduce((acc, [key, count]) => {
    const next = { ...acc };
    const [a] = key;
    next[a] = (acc[a] ?? 0) + count;
    return next;
  }, {});

  // Don't forget to add in the last character (since we only tallied the first
  // part of each pair above, the final one is under-counted).
  const last = polymer[polymer.length - 1];
  counts[last] = (counts[last] ?? 0) + 1;

  return counts;
};

const getDifference = (counts) => {
  const { high, low } = Object.values(counts).reduce(
    ({ high, low }, count) => ({
      high: Math.max(high, count),
      low: Math.min(low, count),
    }),
    { high: 0, low: Number.MAX_SAFE_INTEGER }
  );
  return high - low;
};

const part1 = ({ polymer, insertions }, steps) => {
  const pairs = getPairs(polymer);

  let current = { ...pairs };
  for (let step = 0; step < steps; step += 1) {
    current = insert(current, insertions);
  }

  const counts = countElements(current, polymer);
  return getDifference(counts);
};

const part2 = (data, steps = 40) => {
  return part1(data, steps);
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || ""), 10));
  console.log(`Part 2:`, part2(data(process.argv[2] || ""), 40));
}

module.exports = {
  data,
  part1,
  part2,
};
