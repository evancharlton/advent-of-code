const data = (type = "") => {
  const [seeds, ...maps] = require("./input")(__filename, "\n\n", type)
    .map((map) => {
      const lines = map.split("\n");
      if (lines.length === 1) {
        const [seeds] = lines;
        if (!seeds.startsWith("seeds: ")) {
          throw new Error("Bad input");
        }
        return seeds
          .replace(/^seeds: /, "")
          .split(" ")
          .map((v) => +v);
      }

      const [header, ...data] = lines;
      const [_, fromThing, toThing] = header.match(/^(.+)-to-(.+) map:$/);

      const table = data.map((line) => line.split(" ").map((v) => +v));
      const [min, max] = table.reduce(
        (acc, [_, source, length]) => {
          return [Math.min(acc[0], source), Math.max(acc[1], source + length)];
        },
        [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
      );

      const dataMap = {
        from: fromThing,
        to: toThing,
        table,
        convert: (sourceId) => {
          if (sourceId < min) {
            return sourceId;
          }
          if (sourceId >= max) {
            return sourceId;
          }
          const row = table.find(([_, sourceRange, rangeLength]) => {
            return (
              sourceId >= sourceRange && sourceId < sourceRange + rangeLength
            );
          });

          let res = sourceId;
          if (row) {
            const [destination, source] = row;
            res = destination + (sourceId - source);
          }
          return res;
        },
      };
      return dataMap;
    })
    .filter(Boolean);

  return {
    seeds,
    maps: maps.reduce((acc, map) => ({ ...acc, [map.from]: map }), {}),
  };
};

const part1 = ({ seeds, maps }) => {
  const toLocation = (seedId) => {
    let i = 0;
    let thing = "seed";
    let id = seedId;
    while (i++ < 1000) {
      const map = maps[thing];
      if (!map) {
        return { thing, id };
      }
      id = map.convert(id);
      thing = map.to;
    }
  };

  return Math.min(...seeds.map((id) => toLocation(id).id));
};

const part2 = ({ seeds: inputSeeds, maps }, seedsStr) => {
  const seeds = seedsStr ? seedsStr.split(" ").map((v) => +v) : inputSeeds;
  const toLocation = (seedId) => {
    let i = 0;
    let thing = "seed";
    let id = seedId;
    while (i++ < 1000) {
      const map = maps[thing];
      if (!map) {
        return id;
      }
      id = map.convert(id);
      thing = map.to;
    }
  };

  let total = 0;
  for (let i = 0; i < seeds.length; i += 2) {
    total += seeds[i + 1];
  }

  let n = 0;
  let min = Number.MAX_SAFE_INTEGER;
  let minId = -1;
  let pct = -1;
  for (let i = 0; i < seeds.length; i += 2) {
    const [start, length] = [seeds[i], seeds[i + 1]];
    for (let j = start; j < start + length; j += 1) {
      n += 1;
      const percent = Math.round((n / total) * 100);
      if (percent !== pct) {
        console.log(`${percent}% ...`);
        pct = percent;
      }
      const location = toLocation(j);
      if (location < min) {
        minId = j;
        min = location;
      }
    }
  }

  return min;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || ""), process.argv[3]));
}

module.exports = {
  data,
  part1,
  part2,
};
