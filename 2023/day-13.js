const data = (type = "") => {
  return require("./input")(__filename, "\n\n", type).map((patterns) =>
    patterns.split("\n")
  );
};

const mirror = (patterns, createComparator) => {
  return patterns
    .map((pattern, i) => {
      {
        const comparator = createComparator();
        const column = (x) => {
          return pattern.map((line) => line[x]).join("");
        };

        columns: for (let x = 1; x < pattern[0].length; x += 1) {
          let x1 = x - 1;
          let x2 = x;
          while (x1 >= 0 && x2 < pattern[0].length) {
            const [a, b] = [x1, x2].map((i) => column(i));
            const { same, remainingSmudges, reset } = comparator(a, b);
            if (!same) {
              reset();
              continue columns;
            }
            x1--;
            x2++;

            if (
              remainingSmudges === 0 &&
              (x1 < 0 || x2 === pattern[0].length)
            ) {
              return x;
            }
          }
        }
      }
      {
        const comparator = createComparator();
        rows: for (let y = 1; y < pattern.length; y += 1) {
          let y1 = y - 1;
          let y2 = y;
          while (y1 >= 0 && y2 < pattern.length) {
            const [a, b] = [y1, y2].map((i) => pattern[i]);
            if (!a || !b) {
              return 100 * y;
            }

            const { same, remainingSmudges, reset } = comparator(a, b);
            if (!same) {
              reset();
              continue rows;
            }
            y1--;
            y2++;

            if (remainingSmudges === 0 && (y1 < 0 || y2 === pattern.length)) {
              return 100 * y;
            }
          }
        }
      }
      console.warn(pattern.join("\n"));
      throw new Error(`No reflection found @ ${i}`);
    })
    .reduce((acc, v) => acc + v, 0);
};

const part1 = (patterns) => {
  return mirror(patterns, () => {
    return (a, b) => ({
      same: a === b,
      remainingSmudges: 0,
      reset: () => undefined,
    });
  });
};

const part2 = (patterns) => {
  const createComparator = () => {
    let remainingSmudges = 1;
    return (a, b) => {
      let diffs = 0;
      for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) {
          diffs += 1;
        }
      }

      if (diffs === 1 && remainingSmudges > 0) {
        remainingSmudges -= 1;
        return { same: true, remainingSmudges };
      }
      return {
        same: diffs === 0,
        remainingSmudges,
        reset: () => (remainingSmudges = 1),
      };
    };
  };
  return mirror(patterns, createComparator);
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
