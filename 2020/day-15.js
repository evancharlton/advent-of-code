const data = (type = "") => {
  return require("./input")(__filename, ",", type).map(Number);
};

const part1 = (numbers, limit = 2020) => {
  const spoken = new Uint32Array(limit + 1);

  let said;
  for (let i = 1; i <= limit; i += 1) {
    if (i <= numbers.length) {
      said = numbers[i - 1];
      spoken[said] = i;
      continue;
    }

    const prevTurn = i - 1;
    const lastTime = spoken[said];
    spoken[said] = prevTurn;
    said = lastTime === 0 ? 0 : prevTurn - lastTime;
  }

  return said;
};

const part2 = (numbers) => {
  return part1(numbers, 30_000_000);
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
