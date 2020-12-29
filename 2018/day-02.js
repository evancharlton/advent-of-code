const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line) =>
    line.split("")
  );
};

const count = (values, num) => {
  let total = 0;
  values.forEach((letters) => {
    const counts = new Map();
    letters.forEach((letter) => {
      counts.set(letter, (counts.get(letter) || 0) + 1);
    });

    let incremented = false;
    counts.forEach((count, letter) => {
      if (incremented) {
        return;
      }
      if (count === num) {
        incremented = true;
        total += 1;
      }
    });
  });
  return total;
};

const part1 = (values) => {
  return count(values, 2) * count(values, 3);
};

const part2 = (values) => {
  return undefined;
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
