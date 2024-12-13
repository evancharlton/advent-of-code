const data = (type = "") => {
  return require("./input")(__filename, {
    type,
    trim: true,
    delim: "\n\n",
  }).map((lines) => {
    const [a, b, prize] = lines.split("\n");

    const toCoords = ([x, y]) => {
      return {
        x: +x.replace(/^X[+=]?/, ""),
        y: +y.trim().replace(/^Y[+=]?/, ""),
      };
    };

    return {
      a: toCoords(a.replace(/^Button [AB]: /, "").split(", ")),
      b: toCoords(b.replace(/^Button [AB]: /, "").split(", ")),
      prize: toCoords(prize.replace(/^Prize: /, "").split(", ")),
    };
  });
};

const play = ({ a, b, prize }) => {
  // I know that this is a trap. However ...
  const solutions = [];
  for (let a1 = 0; a1 <= 100; a1 += 1) {
    for (let b1 = 0; b1 <= 100; b1 += 1) {
      const xPos = a.x * a1 + b.x * b1;
      const yPos = a.y * a1 + b.y * b1;
      if (xPos === prize.x && yPos === prize.y) {
        solutions.push({ a: a1, b: b1 });
      }
    }
  }

  if (solutions.length === 0) {
    return 0;
  }

  const costs = solutions.map(({ a, b }) => a * 3 + b).sort((a, b) => a - b);

  return costs[0];
};

const part1 = (records) => {
  return records.map((record) => play(record)).reduce((acc, n) => acc + n, 0);
};

const part2 = (lines) => {
  return undefined;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  play,
  part1,
  part2,
};
