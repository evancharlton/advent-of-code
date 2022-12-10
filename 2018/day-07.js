const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line) =>
    line
      .split(" must be finished before step ")
      .map((piece) => piece.replace("Step ", "").replace(" can begin.", ""))
  );
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
  const reqs = {};
  const dependents = {};
  steps.forEach(([req, after]) => {
    // reqs[req] = reqs[req] || [];
    // reqs[req].push(after);
    // reqs[req].sort();
    reqs[req] = reqs[req] || {};
    reqs[req][after] = null;

    dependents[after] = dependents[after] || [];
    dependents[after].push(req);
    dependents[after].sort();
  });

  const expand = (taskId) => {
    if (!reqs[taskId]) {
      return {};
    }

    return Object.keys(reqs[taskId]).reduce(
      (acc, id) => ({
        ...acc,
        [id]: expand(id),
      }),
      {}
    );
  };

  const startTaskId = "A"; // startTask(steps);
  const taskTree = { [startTaskId]: expand(startTaskId) };

  let last = "";
  const flatten = (node) => {
    const keys = Object.keys(node);
    if (keys.length === 0) {
      throw new Error("wat");
    }

    keys.sort();
    return keys.reduce((acc, key) => {
      const next = node[key];
      if (Object.keys(next).length === 0) {
        // Terminal node
        last = key;
        return acc;
      }
      return `${acc}${key}${flatten(node[key])}`;
    }, "");
  };

  return flatten(taskTree) + last;
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
