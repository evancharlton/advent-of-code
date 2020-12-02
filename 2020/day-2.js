const getInput = require("./input");

const countLetters = (string, letter) => {
  return string.split("").reduce((count, l) => {
    return count + (letter === l ? 1 : 0);
  }, 0);
};

const known = getInput(__filename)
  .split("\n")
  .reduce((acc, line) => {
    const match = line.match(/^([\d]+)-([\d]+) ([a-z]): ([a-z]+)$/);
    if (!match) {
      throw new Error(`Bad input: ${match}`);
    }
    const [_, min, max, letter, password] = match;

    return [
      ...acc,
      { min, max, letter, password, count: countLetters(password, letter) },
    ];
  }, [])
  .filter(({ count, min, max }) => count >= min && count <= max)
  .reduce((acc, { password, count }) => ({ ...acc, [password]: count }), {});

const input = getInput(__filename)
  .split("\n")
  .reduce((acc, line) => {
    const match = line.match(/^([\d]+)-([\d]+) ([a-z]): ([a-z]+)$/);
    const [_, min, max, letter, password] = match;
    const re = new RegExp(
      `^([0-9]+)-([0-9]+) ([a-z]): ((?!\\3).)*(?:((?!\\3).)*\\3((?!\\3).)*){${min},${max}}((?!\\3).)*$`
    );
    return [
      ...acc,
      {
        password,
        count: countLetters(password, letter),
        line,
        match: line.match(re),
      },
    ];
  }, [])
  .filter(({ match }) => !!match);

const success = input.length === 398 || console.length === 602;
if (success) {
  console.log(input.length);
  process.exit(0);
}

console.log(input.slice(), input.length);

const guess = input.reduce(
  (acc, { password, count }) => ({ ...acc, [password]: count }),
  {}
);

const output = {};
Object.entries(known).forEach(([password, count]) => {
  output[password] = {
    guess: undefined,
    ...output[password],
    password,
    known: count,
  };
});

Object.entries(guess).forEach(([password, count]) => {
  output[password] = {
    known: undefined,
    ...output[password],
    password,
    guess: count,
  };
});

Object.entries(output).forEach(([password, { known, guess }]) => {
  if (known === guess) {
    delete output[password];
  }
});

console.table(output);
console.log(Object.keys(output).length, "differences");
