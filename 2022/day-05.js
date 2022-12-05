const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type, false);

  const stacks = [
    [
      /* placeholder */
    ],
  ];
  const columnIdsIndex = lines.findIndex((line) => line.match(/^\s+\d+/));

  const columnIds = lines[columnIdsIndex];
  // Now scan through the column IDs, looking for non-spaces
  for (let i = 0; i < columnIds.length; i += 1) {
    const char = columnIds[i];
    if (char !== " ") {
      // We found a column ID, so add a new stack
      const stack = [];
      for (let n = columnIdsIndex - 1; n >= 0; n -= 1) {
        const stackLine = lines[n];
        stack.push(lines[n][i]);
      }
      stacks.push(stack.map((line) => line.trim()).filter(Boolean));
    }
  }

  const input = [];

  const regex = /^move ([\d]+) from ([\d]+) to ([\d]+)$/;
  for (let i = columnIdsIndex + 2; i < lines.length; i += 1) {
    if (!lines[i].match(regex)) {
      continue;
    }

    const [, num, source, dest] = lines[i].match(regex);
    const obj = { num, source, dest };
    input.push(obj);
  }

  return { stacks, input };
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
