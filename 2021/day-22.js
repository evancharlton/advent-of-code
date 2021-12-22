const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line) => {
    const [state, ranges] = line.split(" ");
    return {
      state,
      ranges: ranges
        .split(",")
        .map((range) => range.replace(/^[xyz]=/, ""))
        .map((range) => {
          const [low, high] = range.split("..").map((v) => +v);
          return [low, high];
        }),
    };
  });
};

const part1 = (steps) => {
  const cube = {};
  steps.forEach(
    ({ ranges: [[xMin, xMax], [yMin, yMax], [zMin, zMax]], state }) => {
      for (let x = Math.max(-50, xMin); x <= Math.min(50, xMax); x += 1) {
        for (let y = Math.max(-50, yMin); y <= Math.min(50, yMax); y += 1) {
          for (let z = Math.max(-50, zMin); z <= Math.min(50, zMax); z += 1) {
            cube[`${x},${y},${z}`] = state;
          }
        }
      }
    }
  );
  return Object.values(cube).filter((state) => state === "on").length;
};

const part2 = (data) => {
  return data;
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
