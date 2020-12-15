const data = (type = "") => {
  return require("./input")(__filename, ",", type).map(Number);
};

const part1 = (numbers, limit = 2020) => {
  const spoken = {};

  let said;
  let i = 1;
  numbers.forEach((n, j) => {
    spoken[n] = [i];
    said = n;
    i += 1;
  });

  while (i <= limit) {
    let [turn, prev] = spoken[said];

    // Do we have a record of this?
    if (turn === undefined) {
      throw new Error(`${said} was spoken for the first time or something`);
    }

    // That was the first time it has been spoken
    if (prev === undefined) {
      prev = turn;
    }

    said = turn - prev;
    [turn] = spoken[said] || [i];

    spoken[said] = [i, turn];
    i += 1;
  }

  return said;
};

const part2 = (numbers) => {
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
