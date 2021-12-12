const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const log = (...args) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...args);
  }
};

const parse = (lines) =>
  lines
    .map((line) => line.split("-"))
    .reduce((map, [a, b]) => {
      const next = { ...map };
      next[a] = map[a] || [];
      next[b] = map[b] || [];

      next[a].push(b);
      next[b].push(a);

      return next;
    }, {});

const isSmall = (cave) => cave.toLowerCase() === cave;

const walk = (map, node, paths, visits, limits) => {
  if (node === "end") {
    log("I am at the end");
    log(paths.map((p) => p.join("-")).join("\n"));
    log("=====");
    return paths.map((p) => [...p, "end"]);
  }

  if (isSmall(node) && visits[node] >= limits[node]) {
    log(`${node} is small are not worth revisiting`);
    return paths;
  }

  log(
    `I am at [${node}] in the map:\n`,
    map,
    "\nI have been to:\n",
    paths.map((p) => `  ${p.join("-")}`).join("\n"),
    `\nI have visited:\n`,
    visits,
    `\nI have the following limits:\n`,
    limits
  );

  const nextPaths =
    paths.length === 0 ? [[node]] : paths.map((p) => [...p, node]);

  const nextCaves = map[node];
  log(`My next caves to explore are:`);
  return nextCaves
    .filter((c) => c !== "start")
    .filter((c) => {
      if (isSmall(c) && visits[c] >= limits[c]) {
        log(` --> ${c} is small and not worth revisiting (from ${node})`);
        return false;
      }
      log(` --> ${c}`);
      return true;
    })
    .map((c) => {
      log(`I am going from ${node} to ${c} now`);
      return walk(
        map,
        c,
        nextPaths,
        {
          ...visits,
          [node]: 1 + (visits[node] ?? 0),
        },
        limits
      );
    })
    .flat();
};

const part1 = (data) => {
  const map = parse(data);
  const limits = Object.keys(map)
    .filter((c) => isSmall(c))
    .reduce((acc, k) => ({ ...acc, [k]: 1 }), {});
  return walk(map, "start", [], {}, limits).length;
};

const part2 = (data) => {
  const map = parse(data);
  const limits = Object.keys(map)
    .filter((c) => isSmall(c))
    .reduce((acc, k) => ({ ...acc, [k]: 1 }), {});
  const allLimits = Object.keys(limits).map((k) => ({ ...limits, [k]: 2 }));
  const paths = new Set();
  for (let i = 0; i < allLimits.length; i += 1) {
    walk(map, "start", [], {}, allLimits[i])
      .map((p) => p.join(","))
      .forEach((p) => paths.add(p));
  }
  return paths.size;
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  // log(`Part 1:`, part1(data(process.argv[2] || "")));
  log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  parse,
};
