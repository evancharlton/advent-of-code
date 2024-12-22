const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map(v => +v);
};

const M = 16777216;

const generator = (seed) => {
  let secret = seed;
  return () => {
    secret = ((((secret * 64) ^ secret) % M) + M) % M;
    secret = (((Math.floor(secret / 32) ^ secret) % M) + M) % M;
    secret = ((((secret * 2048) ^ secret) % M) + M) % M;
    return secret;
  }
}

const part1 = (seeds) => {
  return seeds.map(seed => {
    const gen = generator(seed);
    for (let i = 1; i < 2000; i += 1) {
      gen();
    }
    return gen();
  }).reduce((acc, n) => acc + n, 0)
};

const part2 = (seeds, size = 2000) => {
  const lookups = seeds.map((seed, buyerId) => {
    const gen = generator(seed);
    const numbers = new Array(size + 1);
    numbers[0] = seed;
    const window = new Array(4);
    const sequenceResponseMap = {};
    for (let i = 1; i < size; i += 1) {
      const n = gen();
      numbers[i] = n;

      const price = n % 10;
      const delta = price - numbers[i - 1] % 10
      window.push(delta);
      if (window.length > 4) {
        window.shift();
      }

      if (window.length === 4) {
        const sequence = window.join(',');
        sequenceResponseMap[sequence] = sequenceResponseMap[sequence] ?? price
      }
    }

    return sequenceResponseMap
  })

  const sequencesSet = new Set();
  lookups.forEach((lookupMap) => {
    Object.keys(lookupMap).forEach(key => sequencesSet.add(key))
  });

  // Simulate giving each sequence to see what the result would be
  const best = [...sequencesSet]
    .reduce((acc, seq) => {
      const potential = lookups
        .reduce((total, lookupMap) => total + (lookupMap[seq] ?? 0), 0)
      if (potential > acc.best) {
        return { sequence: seq, best: potential }
      }
      return acc;
    }, { sequence: '', best: -1 })

  return best.best;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  generator,
  part1,
  part2,
};
