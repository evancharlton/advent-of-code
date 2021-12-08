const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((entry) => {
    const [signalPatterns, outputValue] = entry.split(" | ");
    return {
      patterns: signalPatterns.split(" "),
      outputs: outputValue.split(" "),
    };
  });
};

const part1 = (data) => {
  return data.reduce((acc, { outputs }) => {
    return (
      outputs.filter(
        (display) =>
          display.length === 2 ||
          display.length === 3 ||
          display.length === 4 ||
          display.length === 7
      ).length + acc
    );
  }, 0);
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
