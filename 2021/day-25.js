const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line) =>
    line.split("")
  );
};

const copy = (map) => {
  const out = [];
  for (let y = 0; y < map.length; y += 1) {
    out.push([]);
    for (let x = 0; x < map[y].length; x += 1) {
      out[y].push(map[y][x]);
    }
  }
  return out;
};

const stepEast = (map) => {
  let moves = 0;
  const next = copy(map);
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      // Can anyone take a step east?
      if (next[y][x] !== ">") {
        continue;
      }
      const dest = (x + 1) % map[0].length;
      const occupied = map[y][dest];
      if (occupied === ".") {
        next[y][dest] = next[y][x];
        next[y][x] = ".";
        x += 1;
        moves += 1;
      }
    }
  }
  return [next, moves];
};

const stepSouth = (map) => {
  let moves = 0;
  const next = copy(map);
  for (let x = 0; x < map[0].length; x += 1) {
    for (let y = 0; y < map.length; y += 1) {
      // Can anyone take a step south?
      if (next[y][x] !== "v") {
        continue;
      }
      const dest = (y + 1) % map.length;
      const occupied = map[dest][x];
      if (occupied === ".") {
        next[dest][x] = next[y][x];
        next[y][x] = ".";
        y += 1;
        moves += 1;
      }
    }
  }
  return [next, moves];
};

const step = (map) => {
  const [east, eastMoves] = stepEast(map);
  const [south, southMoves] = stepSouth(east);
  return [south, eastMoves + southMoves];
};

const print = (map) => map.map((line) => line.join("")).join("\n");

const part1 = (map) => {
  let steps = 0;
  let working = map;
  while (true) {
    const [next, moves] = step(working);
    steps += 1;
    if (moves === 0) {
      return steps;
    }
    working = next;
  }
};

const part2 = (data) => {
  return data;
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  // console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  step,
  print,
};
