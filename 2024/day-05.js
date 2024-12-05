const { sanity } = require("../library/sanity");

const data = (type = "") => {
  const [rules, update] = require("./input")(__filename, {
    type,
    trim: true,
    delim: "\n\n",
  });
  return {
    rules: rules.split("\n"),
    update: update.split("\n").map((line) => line.split(",").map((v) => +v)),
  };
};

const validate = (rules) => {
  const pre = rules
    .map((v) => v.split("|").map((a) => +a))
    .reduce(
      (acc, [before, after]) => ({
        ...acc,
        [after]: [...(acc[after] || []), before],
      }),
      {}
    );

  return (pages, n) => {
    const seen = new Set();
    const pagesSet = new Set(pages);

    const pageRules = pages.reduce((acc, page) => {
      return {
        ...acc,
        [page]: (pre[page] || []).filter((req) => pagesSet.has(req)),
      };
    }, {});

    for (let i = 0; i < pages.length; i += 1) {
      const page = pages[i];
      const requirements = pageRules[page];

      if (requirements?.length > 0) {
        if (requirements.some((req) => !seen.has(req))) {
          return false;
        }
      }
      seen.add(page);
    }
    return true;
  };
};

const part1 = ({ rules, update }) => {
  return update
    .filter(validate(rules))
    .reduce((acc, order) => acc + order[Math.floor(order.length / 2)], 0);
};

const part2 = ({ rules, update }) => {
  const isValid = validate(rules);

  const invalid = update.filter((pages, n) => {
    return !isValid(pages, n);
  });

  const corrected = invalid.map((job) => {
    const N = job.length;
    const correct = [];

    const limit = sanity(2000);
    while (correct.length < N) {
      limit();
      const page = job.shift();
      if (correct.length === 0) {
        correct.push(page);
        continue;
      }

      // Try it in every spot
      for (let i = 0; i <= correct.length; i += 1) {
        correct.splice(i, 0, page);

        if (isValid(correct)) {
          // Great, move on
          break;
        } else {
          // Unwind the transaction
          correct.splice(i, 1);
        }
      }
    }
    return correct;
  });

  return corrected.reduce(
    (acc, order) => acc + order[Math.floor(order.length / 2)],
    0
  );
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
