const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true });
};

const part1 = (rawLines) => {
  const lines = rawLines.map((line) => line.trim().split(/\s+/));
  const ops = lines.pop();
  const nums = lines.map((line) => line.map((v) => +v));

  const problems = [];
  while (nums[0].length) {
    const problem = [];
    for (let i = 0; i < nums.length; i += 1) {
      problem.push(nums[i].shift());
    }

    problem.unshift(ops.shift());

    problems.push(problem);
  }

  return problems.reduce(
    (acc, [op, ...vals]) =>
      acc + vals.reduce((res, v) => (op === "*" ? res * v : res + v)),
    0
  );
};

const part2 = (lines) => {
  const ops = lines.pop();
  let pointer = lines[0].length - 1;
  const problems = [];
  const problemBuffer = [];
  parseLoop: while (pointer >= 0) {
    const numberArr = [];
    for (let i = 0; i < lines.length; i += 1) {
      const v = lines[i][pointer];
      if (v !== " ") {
        numberArr.push(v);
      }
    }
    if (numberArr.length === 0) {
      pointer -= 1;
      continue parseLoop;
    }

    const number = +numberArr.join("");
    problemBuffer.push(number);

    const op = ops[pointer];
    if (op && op !== " ") {
      // We have a complete problem
      problems.push([op, ...problemBuffer]);
      problemBuffer.length = 0;
    }
    pointer -= 1;
  }

  return problems.reduce(
    (acc, [op, ...vals]) =>
      acc + vals.reduce((res, v) => (op === "*" ? res * v : res + v)),
    0
  );
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
