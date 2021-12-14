const data = (type = "") => {
  const [polymer, insertions] = require("./input")(__filename, "\n\n", type);
  return {
    polymer: polymer.split(""),
    insertions: insertions
      .split("\n")
      .map((line) => line.split(" -> "))
      .reduce((acc, [pair, insertion]) => ({ ...acc, [pair]: insertion }), {}),
  };
};

const parse = (lines) => lines;

const part1 = ({ polymer, insertions }, steps) => {
  let chain = polymer;
  for (let step = 0; step < steps; step += 1) {
    let pointer = 0;
    while (pointer < chain.length - 1) {
      const current = chain[pointer++];
      const next = chain[pointer];
      const pair = [current, next].join("");
      const insertion = insertions[pair];
      if (insertion) {
        chain.splice(pointer, 0, insertion);
        pointer += 1;
      }
    }
  }
  const counts = chain.reduce(
    (acc, element) => ({ ...acc, [element]: (acc[element] ?? 0) + 1 }),
    {}
  );

  const most = ["", 0];
  const least = ["", Number.MAX_SAFE_INTEGER];
  Object.entries(counts).forEach(([element, count]) => {
    if (count > most[1]) {
      most[0] = element;
      most[1] = count;
    } else if (count < least[1]) {
      least[0] = element;
      least[1] = count;
    }
  });
  return most[1] - least[1];
};

const part2 = (data) => {
  return parse(data);
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
  parse,
};
