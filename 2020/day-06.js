const groups = require("./input")(__filename, "\n\n", process.argv[2]);

const uniques = groups.map((group) => {
  const answers = group.replace(/\n/g, "").split("");
  return new Set(answers).size;
});

console.log(uniques.reduce((acc, n) => acc + n, 0));
