const getInput = require("./input");

const nums = getInput(__filename)
  .split("\n")
  .map((v) => +v)
  .filter((v) => v < 2020)
  .sort();

for (let i = 0; i < nums.length - 2; i += 1) {
  const a = nums[i];
  for (let j = i + 1; j < nums.length - 1; j += 1) {
    const b = nums[j];
    for (let k = j + 1; k < nums.length; k += 1) {
      const c = nums[k];
      if (a + b + c === 2020) {
        console.log(a * b * c);
      }
    }
  }
}
