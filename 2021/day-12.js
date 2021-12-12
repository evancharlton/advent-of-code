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

const walk = (map, node, paths, visits) => {
  if (node === "end") {
    log("I am at the end");
    log(paths.map((p) => p.join("-")).join("\n"));
    log("=====");
    return paths.map((p) => [...p, "end"]);
  }

  if (isSmall(node) && visits.has(node)) {
    log(`${node} is small are not worth revisiting`);
    return paths;
  }

  log(
    `I am at [${node}] in the map:\n`,
    map,
    "\nI have been to:\n",
    paths.map((p) => `  ${p.join("-")}`).join("\n"),
    `\nI have visited:`,
    [...visits].sort().join(" ")
  );
  visits.add(node);

  const nextPaths =
    paths.length === 0 ? [[node]] : paths.map((p) => [...p, node]);

  const nextCaves = map[node];
  log(`My next caves to explore are:`);
  return nextCaves
    .filter((c) => {
      if (isSmall(c) && visits.has(c)) {
        log(` --> ${c} is small and not worth revisiting (from ${node})`);
        return false;
      }
      log(` --> ${c}`);
      return true;
    })
    .map((c) => {
      log(`I am going from ${node} to ${c} now`);
      return walk(map, c, nextPaths, new Set([...visits]));
    })
    .flat();
};

const part1 = (data) => {
  const map = parse(data);
  return walk(map, "start", [], new Set()).length;
};

const part2 = (data) => {
  return parse(data);
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  log(`Part 1:`, part1(data(process.argv[2] || "")));
  log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  parse,
};
