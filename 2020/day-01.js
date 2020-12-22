const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .map(Number)
    .filter((v) => v < 2020)
    .sort((a, b) => a - b);
};

const part1 = (nums) => {
  for (let i = 0; i < nums.length - 1; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      const a = nums[i];
      const b = nums[j];
      if (a + b === 2020) {
        return a * b;
      }
    }
  }
};

const part2 = (nums) => {
  for (let i = 0; i < nums.length - 2; i += 1) {
    for (let j = i + 1; j < nums.length - 1; j += 1) {
      for (let k = j + 1; k < nums.length; k += 1) {
        const a = nums[i];
        const b = nums[j];
        const c = nums[k];
        if (a + b + c === 2020) {
          return a * b * c;
        }
      }
    }
  }
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
