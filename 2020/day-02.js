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
  .map((entry) => {
    const { min, max, letter, password } = entry;
    const first = password[min - 1] === letter;
    const second = password[max - 1] === letter;

    let isValid = (first && !second) || (!first && second);

    return {
      ...entry,
      isValid,
    };
  })
  .filter((entry) => entry.isValid);

console.log(input.length);
