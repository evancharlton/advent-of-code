const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const part1 = (data) => {
  const numbers = data.map((d) => +d);
  return numbers.reduce((count, reading, i) => {
    if (i === 0) {
      return count;
    }
    if (reading > numbers[i - 1]) {
      return count + 1;
    }
    return count;
  }, 0);
};

const part2 = (data) => {
  return data
    .map((d) => +d)
    .map((value, i, numbers) => {
      if (i < 2) {
        return 0;
      }
      return numbers[i - 2] + numbers[i - 1] + value;
    })
    .filter((sum) => sum !== 0)
    .reduce((count, reading, i, numbers) => {
      if (i === 0) {
        return count;
      }
      if (reading > numbers[i - 1]) {
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
