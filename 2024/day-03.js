const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true });
};

const MUL = /mul\((\d+),(\d+)\)/;

const part1 = (lines) => {
  return lines
    .map((line) => line.match(new RegExp(MUL, "g")))
    .flat()
    .reduce((acc, ins) => {
      const [_, a, b] = String(ins).match(MUL);
      return acc + a * b;
    }, 0);
};

const part2 = (lines) => {
  return lines
    .map((line) => line.match(/(?:mul\((\d+),(\d+)\)|do\(\)|don't\(\))/g))
    .flat()
    .reduce(
      ({ total, enabled }, ins) => {
        if (ins === "do()") {
          return {
            total,
            enabled: true,
          };
        } else if (ins === "don't()") {
          return {
            total,
            enabled: false,
          };
        } else if (!enabled) {
          return {
            total,
            enabled,
          };
        }
        const [_, a, b] = String(ins).match(MUL);
        return { total: total + a * b, enabled };
      },
      { total: 0, enabled: true }
    ).total;
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
