const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line) =>
    line
      .split(" must be finished before step ")
      .map((piece) => piece.replace("Step ", "").replace(" can begin.", ""))
  );
};

const walk = (map, line) => {
  const indent = line
    .split("")
    .map(() => " ")
    .join(" ");
  console.log(`${indent} -> walk(map, ${line})`);
  const last = line[line.length - 1];

  const steps = map.get(last);
  if (!steps) {
    console.log(indent, `${line} <--`);
    return line;
  }

  return steps.sort().reduce((acc, next) => {
    return walk(map, `${acc}${next}`);
  }, line);
};

const part1 = (input) => {
  let root = undefined;
  const map = new Map();
  const children = new Set();
  input.forEach(([before, after]) => {
    let node = map.get(before);
    if (!node) {
      node = [];
    }
    node.push(after);
    map.set(before, node);
    children.add(after);
  });

  const [start] = [...map.keys()].filter((key) => !children.has(key));

  return walk(map, start);
  return map;
};

const part2 = (input) => {
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
