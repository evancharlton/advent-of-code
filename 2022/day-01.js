const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const part1 = (lines) => {
  const elves = [];
  let elf = [];
  lines.forEach((line) => {
    if (!line) {
      elves.push(elf);
      elf = [];
      return;
    }

    elf.push(+line);
  });
  elves.push(elf);

  const sums = elves.map((elf) => elf.reduce((sum, a) => sum + a, 0));

  return Math.max(...sums);
};

const part2 = (lines) => {
  const elves = [];
  let elf = [];
  lines.forEach((line) => {
    if (!line) {
      elves.push(elf);
      elf = [];
      return;
    }

    elf.push(+line);
  });
  elves.push(elf);

  return elves
    .map((elf) => elf.reduce((sum, a) => sum + a, 0))
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((sum, a) => sum + a, 0);
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
