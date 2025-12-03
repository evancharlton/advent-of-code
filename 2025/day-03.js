const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map((line) =>
    line.split("").map((v) => +v)
  );
};

const part1 = (lines) => {
  return lines.reduce((acc, bank) => {
    let highest = 0;
    for (let x = 0; x < bank.length - 1; x += 1) {
      for (let y = x + 1; y < bank.length; y += 1) {
        const combination = +`${bank[x]}${bank[y]}`;
        highest = Math.max(highest, combination);
      }
    }
    return acc + highest;
  }, 0);
};

const part2 = (lines) => {
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
