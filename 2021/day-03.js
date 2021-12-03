const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const part1 = (lines) => {
  let gamma = "";
  let epsilon = "";
  for (let i = 0; i < lines[0].length; i += 1) {
    let zeros = 0;
    let ones = 1;
    lines.forEach((line) => {
      if (line[i] === "0") {
        zeros += 1;
      } else {
        ones += 1;
      }
    });
    if (zeros > ones) {
      gamma += "0";
      epsilon += "1";
    } else {
      gamma += "1";
      epsilon += "0";
    }
  }
  const gammaRate = parseInt(gamma, 2);
  const epsilonRate = parseInt(epsilon, 2);

  return gammaRate * epsilonRate;
};

const part2 = (data) => {
  return undefined;
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
