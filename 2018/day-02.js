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
  const out = [];
  values.forEach((id, i, all) => {
    const others = all.filter((_, j) => i !== j);
    const neighbors = others.filter((otherId) => {
      let differences = 0;
      id.forEach((char, j) => {
        if (differences >= 2) {
          return;
        }
        if (otherId[j] !== char) {
          differences += 1;
        }
      });
      return differences === 1;
    });
    out.push(...neighbors);
  });

  const [result] = out;
  const union = [];
  result.forEach((letter, i) => {
    const count = out.reduce((acc, val) => {
      if (val[i] === letter) {
        return acc + 1;
      }
      return acc;
    }, 0);
    if (count === out.length) {
      union.push(letter);
    }
  });
  return union.join("");
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
