const getInput = require("./input");

const countLetters = (string, letter) => {
  return string.split("").reduce((count, l) => {
    return count + (letter === l ? 1 : 0);
  }, 0);
};

const input = getInput(__filename)
  .split("\n")
  .reduce((acc, line) => {
    const match = line.match(/^([\d]+)-([\d]+) ([a-z]): ([a-z]+)$/);
    if (!match) {
      throw new Error(`Bad input: ${match}`);
    }
    const [_, min, max, letter, password] = match;

    return [...acc, { min, max, letter, password }];
  }, [])
  .map((entry) => ({
    ...entry,
    count: countLetters(entry.password, entry.letter),
  }))
  .map((entry) => ({
    ...entry,
    isValid: entry.count >= entry.min && entry.count <= entry.max,
  }))
  .filter((entry) => entry.isValid);

console.log(input.length);
