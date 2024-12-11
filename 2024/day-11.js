const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true })[0]
    .split(" ")
    .map((v) => +v);
};

const operate = (stone) => {
  if (stone === 0) {
    return 1;
  }

  const str = String(stone);
  if (str.length % 2 === 0) {
    const half = str.length / 2;
    return [parseInt(str.substring(0, half)), parseInt(str.substring(half))];
  }

  return stone * 2024;
};

const part1 = (startingStones) => {
  return part2(startingStones, 25);
};

/** {@code stone@times} -> number */
const CACHE = new Map();

const part2 = (startingStones, times = 75) => {
  if (times === 0) {
    return startingStones.length;
  }
  return startingStones.reduce((total, stone) => {
    const key = `${stone}@${times}`;
    if (CACHE.has(key)) {
      return total + CACHE.get(key);
    }

    const result = part2([operate(stone)].flat(), times - 1);
    CACHE.set(key, result);
    return total + result;
  }, 0);
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
