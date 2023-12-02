const data = (type = "") => {
  return require("./input")(__filename, "\n", type).filter(Boolean);
};

const part1 = (lines) => {
  return lines
    .map((line) => {
      try {
        const [_, first] = line.match(/^[a-z]*([\d])/);
        const [__, last] = line.match(/([\d])[a-z]*$/);
        return +[first, last].join("");
      } catch (e) {
        console.log(line, e);
        throw e;
      }
    })
    .reduce((acc, v) => acc + v);
};

const part2 = (lines) => {
  const NUMS = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };

  return lines
    .map((line) => {
      const first = (() => {
        for (let i = 0; i < line.length; i += 1) {
          if (!Number.isNaN(+line[i])) {
            return +line[i];
          }

          const sub = line.substring(i);
          for (const key in NUMS) {
            if (sub.startsWith(key)) {
              return NUMS[key];
            }
          }
        }
        console.warn(`No start digit for ${line}`);
      })();
      const last = (() => {
        for (let i = line.length - 1; i >= 0; i -= 1) {
          if (!Number.isNaN(+line[i])) {
            return +line[i];
          }

          const sub = line.substring(i);
          for (const key in NUMS) {
            if (sub.startsWith(key)) {
              return NUMS[key];
            }
          }
        }
        console.warn(`No end digit for ${line}`);
      })();
      return +[first, last].join("");
    })
    .reduce((acc, v) => acc + v);
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
