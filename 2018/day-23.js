const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map(parseRobots);
};

const parseRobots = (line) => {
  const [pos, r] = line.split(", r=");
  return [+r, pos.replace("pos=<", "").replace(">", "").split(",").map(Number)];
};

const distance = ([ax, ay, az], [bx, by, bz]) => {
  return Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz);
};

const part1 = (robots) => {
  const [[max, point]] = robots.sort(([a], [b]) => b - a);
  return robots
    .map(([_, location]) => location)
    .filter((coords) => {
      return distance(point, coords) <= max;
    }).length;
};

const part2 = (robots) => {
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
