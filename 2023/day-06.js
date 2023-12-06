const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const race = (races) => {
  let out = 1;
  races.forEach(([time, distance]) => {
    let ways = 0;
    for (let t = 1; t < time; t += 1) {
      const d = (time - t) * t;
      if (d > distance) {
        ways += 1;
      }
    }
    out *= ways;
  });
  return out;
};

const part1 = ([time, distance]) => {
  const times = time
    .substring("Time:".length)
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((v) => v.trim())
    .map((v) => +v);
  const distances = distance
    .substring("Distance:".length)
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((v) => v.trim())
    .map((v) => +v);
  const races = [];
  for (let i = 0; i < times.length; i += 1) {
    races.push([times[i], distances[i]]);
  }
  return race(races);
};

const part2 = ([time, distance]) => {
  const races = [];
  races.push([
    +time.substring("Time:".length).replace(/\s/g, ""),
    +distance.substring("Distance:".length).replace(/\s/g, ""),
  ]);
  return race(races);
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
