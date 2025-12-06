const data = (type = "") => {
  const lines = require("./input")(__filename, { type, trim: true }).map(
    (line) => line.trim().split(/\s+/)
  );

  const ops = lines.pop();

  const nums = lines.map((line) => line.map((v) => +v));

  const out = [];
  while (nums[0].length) {
    const problem = [];
    for (let i = 0; i < nums.length; i += 1) {
      problem.push(nums[i].shift());
    }

    problem.unshift(ops.shift());

    out.push(problem);
  }
  return out;
};

const part1 = (problems) => {
  return problems.reduce(
    (acc, [op, ...vals]) =>
      acc + vals.reduce((res, v) => (op === "*" ? res * v : res + v)),
    0
  );
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
