const data = (type = "") => {
  return require("./input")(__filename, "\n\n", type)
    .map((tileBlock) => {
      const [header, ...lines] = tileBlock.split("\n");
      const id = header.replace("Tile ", "").replace(":", "");
      return {
        id: +id,
        lines,
      };
    })
    .reduce((acc, { id, lines }) => ({ ...acc, [id]: lines }), {});
};

const part1 = (input) => {
  const picture = new Array(9);
  const fingerprinted = Object.entries(input)
    .map(([id, lines]) => {
      const north = lines[0];
      const south = lines[lines.length - 1];
      const [west, east] = lines.reduce(
        ([w, e], line) => {
          const start = line[0];
          const end = line[line.length - 1];
          return [w + start, e + end];
        },
        ["", ""]
      );
      const edges = [north, south, east, west];
      const flips = [
        north.split("").reverse().join(""),
        south.split("").reverse().join(""),
        east.split("").reverse().join(""),
        west.split("").reverse().join(""),
      ];
      return {
        id,
        edges,
        flips,
      };
    })
    .reduce((acc, { id, edges, flips }) => {
      const next = { ...acc };
      edges.forEach((edge) => {
        next[edge] = [...(next[edge] || []), id];
      });
      flips.forEach((flip) => {
        next[flip] = [...(next[flip] || []), id];
      });
      return next;
    }, {});

  const neighbored = Object.entries(fingerprinted).reduce(
    (acc, [edge, [first, second]]) => {
      if (!second) {
        return acc;
      }

      const next = { ...acc };
      next[first] = next[first] || new Set();
      next[second] = next[second] || new Set();

      next[first].add(second);
      next[second].add(first);

      return next;
    },
    {}
  );

  const corners = Object.entries(neighbored)
    .filter(([id, neighbors]) => neighbors.size === 2)
    .map(([id]) => id)
    .reduce((acc, id) => acc * id, 1);
  return corners;
};

const part2 = (input) => {
  return undefined;
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
