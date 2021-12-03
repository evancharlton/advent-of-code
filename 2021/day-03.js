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

const countBits = (lines, position) => {
  let zeros = 0;
  let ones = 0;
  lines.forEach((line) => {
    if (line[position] === "0") {
      zeros += 1;
    } else {
      ones += 1;
    }
  });
  return { zeros, ones };
};

const part2 = (lines) => {
  let oxygen = [...lines];
  let c02 = [...lines];
  for (let i = 0; i < lines[0].length; i += 1) {
    if (oxygen.length > 1) {
      const { zeros, ones } = countBits(oxygen, i);
      const needle = ones >= zeros ? "1" : "0";
      oxygen = oxygen.filter((line) => line[i] === needle);
    }

    if (c02.length > 1) {
      const { zeros, ones } = countBits(c02, i);
      const needle = zeros <= ones ? "0" : "1";
      c02 = c02.filter((line) => line[i] === needle);
    }
  }

  return parseInt(oxygen[0], 2) * parseInt(c02[0], 2);
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
