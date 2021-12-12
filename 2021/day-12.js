const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
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
    return paths.map((p) => [...p, "end"]);
  }

  if (isSmall(node) && visits[node] >= limits[node]) {
    return paths;
  }

  const nextPaths =
    paths.length === 0 ? [[node]] : paths.map((p) => [...p, node]);

  const nextCaves = map[node];
  return nextCaves
    .filter((c) => c !== "start")
    .filter((c) => {
      if (isSmall(c) && visits[c] >= limits[c]) {
        return false;
      }
      return true;
    })
    .map((c) =>
      walk(
        map,
        c,
        nextPaths,
        { ...visits, [node]: 1 + (visits[node] ?? 0) },
        limits
      )
    )
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
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  parse,
};
