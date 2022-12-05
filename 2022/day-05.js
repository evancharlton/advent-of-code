const data = (type = "") => {
  // It's too hard to parse the input.
  const stacks = (() => {
    if (type === "test") {
      return [[], ["Z", "N"], ["M", "C", "D"], ["P"]];
    }
    return [
      [],
      "WBGZRDCV".split("").reverse(),
      "VTSBCFWG".split("").reverse(),
      "WNSBC".split("").reverse(),
      "PCVJNMGQ".split("").reverse(),
      "BHDFLST".split("").reverse(),
      "NMWTVJ".split("").reverse(),
      "GTSCLFP".split("").reverse(),
      "ZDB".split("").reverse(),
      "WZNM".split("").reverse(),
    ];
  })();

  const regex = /^move ([\d]+) from ([\d]+) to ([\d]+)$/;

  const input = require("./input")(__filename, "\n\n", type)[1]
    .split("\n")
    .filter((line) => line.match(regex))
    .map((line) => {
      const [, num, source, dest] = line.match(regex);
      return { num, source, dest };
    });

  return {
    stacks,
    input,
  };
};

const part1 = ({ input, stacks }) => {
  input.forEach(({ source: srcId, dest: destId, num }, ins) => {
    const source = stacks[srcId];
    const dest = stacks[destId];

    for (let i = 0; i < num; i += 1) {
      if (source.length === 0) {
        throw new Error(`Ran out of crates in source stack ${source} @ ${ins}`);
      }
      const crate = source.pop();
      dest.push(crate);
    }
  });

  return stacks.reduce((acc, stack, i) => {
    if (i === 0) {
      return acc;
    }
    return acc + stack[stack.length - 1];
  }, "");
};

const part2 = ({ input, stacks }) => {
  input.forEach(({ source: srcId, dest: destId, num }, ins) => {
    const source = stacks[srcId];
    const dest = stacks[destId];

    const crates = [];
    for (let i = 0; i < num; i += 1) {
      if (source.length === 0) {
        throw new Error(`Ran out of crates in source stack ${source} @ ${ins}`);
      }
      const crate = source.pop();
      crates.unshift(crate);
    }
    dest.push(...crates);
  });

  return stacks.reduce((acc, stack, i) => {
    if (i === 0) {
      return acc;
    }
    return acc + stack[stack.length - 1];
  }, "");
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
