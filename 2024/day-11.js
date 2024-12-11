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

const blink = (stones) => {
  return stones.map((stone) => operate(stone)).flat();
};

const part1 = (startingStones) => {
  let stones = [...startingStones];
  for (let i = 0; i < 25; i += 1) {
    stones = blink(stones);
  }
  return stones.length;
};

const part2 = (startingStones) => {
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
