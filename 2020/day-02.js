const data = (type = "") => {
  return require("./input")(__filename, "\n", type).reduce((acc, line) => {
    const [_, min, max, letter, password] = line.match(
      /^([\d]+)-([\d]+) ([a-z]): ([a-z]+)$/
    );
    return [...acc, { min, max, letter, password }];
  }, []);
};

const part1 = (passwords) => {
  return passwords.filter((entry) => {
    const { min, max, letter, password } = entry;
    const letterCount = password.split("").filter((l) => l === letter).length;
    return letterCount >= min && letterCount <= max;
  }).length;
};

const part2 = (passwords) => {
  return passwords.filter((entry) => {
    const { min, max, letter, password } = entry;
    const first = password[min - 1] === letter;
    const second = password[max - 1] === letter;
    return (first && !second) || (!first && second);
  }).length;
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
