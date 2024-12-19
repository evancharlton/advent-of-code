const data = (type = "") => {
  const [options, requests] = require("./input")(__filename, { type, trim: true, delim: "\n\n" });
  return {
    options: options.split(',').map(v => v.trim()), //.reduce((acc, pattern) => ({ ...acc, [pattern]: true }), {}),
    requests: requests.split("\n").map(v => v.trim()).filter(Boolean)
  }
};

const examiner = (options) => {
  const cache = new Map();
  const examine = request => {
    if (request.length === 0) {
      return 1;
    }

    const possibilities = options.filter(option => request.startsWith(option))
    if (possibilities.length === false) {
      return 0;
    }

    return possibilities.reduce((acc, poss) => {
      const remaining = request.substring(poss.length)
      if (!cache.has(remaining)) {
        cache.set(remaining, examine(remaining))
      }
      return acc + cache.get(remaining)
    }, 0)
  };

  return examine
}

const part1 = ({ requests, options }) => {
  const examine = examiner(options);
  return requests.map(request => examine(request)).filter(v => v > 0).length;
};

const part2 = ({ requests, options }) => {
  const examine = examiner(options);
  return requests.reduce((acc, request) => acc + examine(request), 0);
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
