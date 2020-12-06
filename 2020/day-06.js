const groups = require("./input")(__filename, "\n\n", process.argv[2]);

const uniques = groups.map((group) => {
  const responses = group.split("\n").map((line) => line.split(""));
  const out = responses.reduce((acc, person) => {
    if (acc === undefined) {
      return person;
    }
    return acc.filter((v) => person.includes(v));
  }, undefined);
  return out.length;
});

console.log(uniques.reduce((acc, n) => acc + n, 0));
