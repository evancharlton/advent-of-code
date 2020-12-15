const data = (type = "") => {
  return require("./input")(__filename, ",", type).map(Number);
};

const part1 = (numbers, limit = 2020) => {
  const spoken = new Map();

  let said;
  let i = 1;
  numbers.forEach((n, j) => {
    spoken.set(n, [i]);
    said = n;
    i += 1;
  });

  while (i <= limit) {
    let [turn, prev] = spoken.get(said) || [];

    // Do we have a record of this?
    if (turn === undefined) {
      throw new Error(`${said} was spoken for the first time or something`);
    }

    // That was the first time it has been spoken
    if (prev === undefined) {
      prev = turn;
    }

    said = turn - prev;
    [turn] = spoken.get(said) || [i];

    spoken.set(said, [i, turn]);
    i += 1;

    if (i % 10000 === 0) {
      console.log(`Still working ... ${i}`);
    }
  }

  return said;
};

const part2 = (numbers) => {
  // node --max_old_space_size=8192
  return part1(numbers, 30_000_000);
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
