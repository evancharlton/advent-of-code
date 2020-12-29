const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line) => {
    const [id, x, y, w, h] = line
      .match(/^#([\d]+) @ ([\d]+),([\d]+): ([\d]+)x([\d]+)$/)
      .map(Number)
      .filter((v) => !Number.isNaN(v));
    return { id, x, y, w, h };
  });
};

const getInches = (claims) => {
  const inches = new Map();
  claims.forEach(({ x, y, w, h }) => {
    for (let i = y; i < y + h; i += 1) {
      for (let j = x; j < x + w; j += 1) {
        const inchId = `${j},${i}`;
        inches.set(inchId, (inches.get(inchId) || 0) + 1);
      }
    }
  });
  return inches;
};

const part1 = (claims) => {
  const inches = getInches(claims);

  let total = 0;
  inches.forEach((count) => {
    if (count > 1) {
      total += 1;
    }
  });
  return total;
};

const part2 = (claims) => {
  const inches = getInches(claims);

  const [unique] = claims
    .filter(({ x, y, w, h }) => {
      for (let i = y; i < y + h; i += 1) {
        for (let j = x; j < x + w; j += 1) {
          const inchId = `${j},${i}`;
          if (inches.get(inchId) !== 1) {
            return false;
          }
        }
      }
      return true;
    })
    .map(({ id }) => id);

  return unique;
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
