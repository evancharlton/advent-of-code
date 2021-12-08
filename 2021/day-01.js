const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((d) => +d);
};

const part1 = (readings) => {
  return readings.reduce((count, reading, i) => {
    if (i === 0) {
      return count;
    }
    if (reading > readings[i - 1]) {
      return count + 1;
    }
    return count;
  }, 0);
};

const part2 = (readings) => {
  return readings
    .map((value, i) => {
      if (i < 2) {
        return 0;
      }
      return readings[i - 2] + readings[i - 1] + value;
    })
    .filter((sum) => sum !== 0)
    .reduce((count, reading, i, readings) => {
      if (i === 0) {
        return count;
      }
      if (reading > readings[i - 1]) {
        return count + 1;
      }
      return count;
    }, 0);
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
