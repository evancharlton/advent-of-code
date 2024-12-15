const { sanity } = require("../library/sanity")

const data = (type = "") => {
  const [map, instructions] = require("./input")(__filename, { type, trim: true, delim: "\n\n" });
  return {
    map: map.split("\n").reduce((acc, line, y, lines) => {
      for (let x = 0; x < line.length; x += 1) {
        acc[`${x},${y}`] = line[x]
        if (line[x] === '@') {
          acc.x = x;
          acc.y = y;
        }
      }
      acc.width = Math.max(lines.length, acc.width);
      acc.height = lines.length
      return acc
    }, { width: 0, x: -1, y: -1 }),
    instructions: instructions.split('\n').join('').split('')
  }
};

const MOVES = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  "<": { x: -1, y: 0 }
}

const deltas = (map, direction) => {
  const ids = [];

  const { x: dx, y: dy } = MOVES[direction]

  let x = map.x;
  let y = map.y;
  while (y >= 0 && y < map.height && x >= 0 && x < map.width) {
    ids.push({ x, y })
    x += dx;
    y += dy;
    const key = `${x},${y}`
    const next = map[key];

    if (next === '#') {
      return []
    }

    if (next === '.') {
      break
    }
  }

  return ids;
}

const print = ({ width, height, ...map }, { x: refX = -1, y: refY = -1, msg = '' } = {}) => {
  const output = [];
  for (let y = 0; y < height; y += 1) {
    const row = []
    for (let x = 0; x < width; x += 1) {
      row.push(x === refX && y === refY ? 'X' : map[`${x},${y}`])
    }
    output.push(row.join(' '));
  }
  console.log(`${msg}\n${output.join('\n')}`)
}

const part1 = ({ instructions, map: startMap }) => {
  print(startMap, { msg: 'start' })

  let map = { ...startMap }
  const check = sanity(200_000);
  for (const instruction of instructions) {
    check();
    const { x: dx, y: dy } = MOVES[instruction]
    const steps = deltas(map, instruction)
    if (steps.length === 0) {
      // print(map, { msg: `No change after ${instruction}` })
      continue;
    }

    const nextMap = { ...map };
    for (const { x, y } of steps) {
      nextMap[`${x + dx},${y + dy}`] = map[`${x},${y}`]
    }
    nextMap[`${nextMap.x},${nextMap.y}`] = '.'
    nextMap.x += dx;
    nextMap.y += dy;

    map = nextMap
    // print(map, { msg: `After ${instruction}` })
  }

  return Object.entries(map).filter(([key, value]) => key.includes(",") && value === 'O').map(([key]) => key.split(",").map(v => +v)).map(([x, y]) => 100 * y + x).reduce((acc, n) => acc + n, 0)
};

const part2 = (lines) => {
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
