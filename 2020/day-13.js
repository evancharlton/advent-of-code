const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type);
  const [earliest, schedules] = lines;
  const buses = schedules
    .split(",")
    .filter((s) => s !== "x")
    .map(Number);
  return { earliest: +earliest, buses };
};

const part1 = ({ earliest, buses }) => {
  let now = earliest;
  while (true) {
    const leaving = buses.find((id) => {
      return now % id === 0;
    });
    if (leaving) {
      return leaving * (now - earliest);
    }
    now += 1;
  }
};

const part2 = (lines) => {
  // TODO
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
