const { astar } = require("../library/astar");

const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true }).map((line) => {
    const [rawLights, ...rest] = line.split(" ");
    const rawJoltage = rest.pop();

    const lights = rawLights.substring(1, rawLights.length - 1);
    const diagrams = rest.map((diagram) =>
      diagram
        .substring(1, diagram.length - 1)
        .split(",")
        .map((v) => +v)
    );

    return {
      lights,
      lightsInt: Number.parseInt(
        lights.replace(/\./g, "0").replace(/#/g, "1"),
        2
      ),
      diagrams: diagrams,
      diagramInts: diagrams.map((offsets) => {
        const fill = new Array(lights.length).fill("0");
        for (const offset of offsets) {
          fill[offset] = "1";
        }
        return Number.parseInt(fill.join(""), 2);
      }),
      joltage: rawJoltage
        .substring(1, rawJoltage.length - 1)
        .split(",")
        .map((v) => +v),
    };
  });
};

const part1 = (machines) => {
  return machines
    .map(({ lightsInt: target, lights: targetStr, diagramInts: btns }) => {
      const N = targetStr.length;
      const path = astar({
        start: 0,
        neighbors: (lights) => {
          return btns.map((btn) => lights ^ btn);
        },
        weight: (neighbor, current) => {
          let diffs = 1;
          for (let i = 0; i < Math.pow(2, N); i += 1) {
            diffs += (target & (1 << i)) === (current & (1 << i)) ? 0 : 1;
          }

          return diffs;
        },
        goal: (current) => current === target,
        h: (neighbor) => {
          // If we think the neighbor gets us closer to the goal then go with it
          let diffs = N;
          for (let i = 0; i < Math.pow(2, N); i += 1) {
            diffs += (target & (1 << i)) === (neighbor & (1 << i)) ? 0 : 1;
          }

          return diffs;
        },
      });

      return path.length;
    })
    .reduce((acc, n) => acc + n);
};

const part2 = () => {
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
