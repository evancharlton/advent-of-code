const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const part1 = (data) => {
  // I did this one by hand, lol
  const A = 1;
  const B = 10;
  const C = 100;
  const D = 1000;
  // prettier-ignore
  const routine = [
    D, 2,
    A, 9,
    D, 3,
    D, 4,
    A, 3,
    C, 7,
    B, 2,
    C, 5,
    B, 3,
    B, 5,
    A, 7,
    A, 2
  ];
  let sum = 0;
  for (let i = 0; i < routine.length; i += 2) {
    const cost = routine[i];
    const steps = routine[i + 1];
    sum += cost * steps;
  }
  return sum;
};

const part2 = (data) => {
  return data;
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
