const data = (type = "") => {
  const [turns, ...lookup] = require("./input")(__filename, "\n", type).filter(
    Boolean
  );

  let turnI = 0;
  const ins = () => {
    return turns[turnI++ % turns.length];
  };

  const reset = () => {
    turnI = 0;
  };

  return {
    ins,
    reset,
    lookup: lookup
      .map((line) => {
        try {
          const [_, id, left, right] = line.match(/^(.+) = \((.+), (.+)\)$/);
          return [id, left, right];
        } catch (e) {
          console.debug(`Failed parsing ${line}`);
          throw e;
        }
      })
      .reduce(
        (acc, [id, left, right]) => ({
          ...acc,
          [id]: { L: left, R: right },
        }),
        {}
      ),
  };
};

const part1 = ({ ins, lookup }) => {
  let current = "AAA";
  let steps = 0;
  while (current !== "ZZZ") {
    const node = lookup[current];
    const instruction = ins();
    const next = node[instruction];
    current = next;
    steps++;
  }
  return steps;
};

const part2 = ({ ins, reset, lookup }) => {
  const loops = Object.keys(lookup)
    .filter((key) => key.endsWith("A"))
    .map((pos) => {
      let current = pos;
      let steps = 0;
      while (!current.endsWith("Z")) {
        const instruction = ins();
        const next = lookup[current][instruction];
        current = next;
        steps++;
      }
      reset();
      return steps;
    });

  while (loops.length > 1) {
    const a = loops.shift();
    const b = loops.shift();
    loops.unshift(lcm(a, b));
  }
  return loops.shift();
};

const lcm = (a, b) => {
  let max = Math.max(a, b);
  let min = Math.min(a, b);
  for (let i = max; i < Number.MAX_SAFE_INTEGER; i += max) {
    if (i % min === 0) {
      return i;
    }
  }
  throw new Error("Impossible");
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
