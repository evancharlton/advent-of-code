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

const startTask = (steps) => {
  const reqs = steps.reduce((acc, [req]) => ({ ...acc, [req]: true }), {});

  steps
    .map(([, after]) => after)
    .forEach((after) => {
      if (reqs[after]) {
        delete reqs[after];
      }
    });

  const keys = Object.keys(reqs);
  if (keys.length !== 1) {
    throw new Error("Too many starting points");
  }

  return keys[0];
};

const part1 = (steps) => {
  const tasks = {};
  steps.forEach(([req, task]) => {
    tasks[req] = tasks[req] || [];
    tasks[task] = tasks[task] || [];
    tasks[task].push(req);
    tasks[task].sort();
  });

  const lines = Object.entries(tasks).map(([task, reqs]) => {
    return `${task}: ${reqs.join(" ")}\n\techo ${task}`;
  });

  const allTasks = new Set(Object.values(tasks).flat());
  const missing = Object.keys(tasks).find((task) => !allTasks.has(task));

  lines.push(`answer: ${missing}\n`);

  return lines.join("\n\n");

  const start = Object.entries(tasks).find(([task, reqs]) => !reqs.length)[0];

  return tasks;
};

const part1b = (steps) => {
  const reqs = {};
  const dependents = {};
  steps.forEach(([req, after]) => {
    reqs[req] = reqs[req] || [];
    reqs[req].push(after);
    reqs[req].sort();

    dependents[after] = dependents[after] || [];
    dependents[after].push(req);
    dependents[after].sort();
  });

  const finishedTasks = {};
  const tasks = [startTask(steps)];
  while (tasks.length) {
    const task = tasks.shift();
  }

  return execute(tree, "");
};

const part1a = (input) => {
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
  const output = part1(data(process.argv[2] || ""));
  const { writeFileSync } = require("fs");
  writeFileSync("Makefile", output);
  console.log(`Part 1:`, output);
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
