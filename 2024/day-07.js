const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map((line) =>
    line.split(" ").map((v, i) => {
      if (i === 0) {
        return +String(v).substring(0, v.length - 1);
      }
      return +v;
    })
  );
};

const part1 = (lines) => {
  return lines
    .map((line) => {
      const [total, start, ...values] = line;

      for (
        let operatorI = 0;
        operatorI < Math.pow(2, values.length);
        operatorI += 1
      ) {
        let value = start;
        for (let i = 0; i < values.length; i += 1) {
          const operator = operatorI & (1 << i);
          if (operator) {
            value *= values[i];
          } else {
            value += values[i];
          }
          if (value > total) {
            break;
          }
        }
        if (total === value) {
          return total;
        }
      }
      return -1;
    })
    .filter((v) => v >= 0)
    .reduce((acc, v) => acc + v, 0);
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
