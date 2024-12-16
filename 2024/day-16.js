const { astar } = require("../library/astar")
const { sanity } = require("../library/sanity")

const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true });
};

const part1 = (lines) => {
  const start = { x: -1, y: -1, heading: 'E' };
  const end = { x: -2, y: -2 };
  for (let y = 0; y < lines.length; y += 1) {
    for (let x = 0; x < lines[y].length; x += 1) {
      if (lines[y][x] === 'S') {
        start.x = x;
        start.y = y;
      } else if (lines[y][x] === 'E') {
        end.x = x;
        end.y = y;
      }
    }
  }

  const DELTAS = {
    N: { dx: 0, dy: -1 },
    E: { dx: 1, dy: 0 },
    S: { dx: 0, dy: 1 },
    W: { dx: -1, dy: 0 }
  }

  const CONTINUE = {
    N: ({ x, y }) => ({ x: x + 0, y: y - 1, heading: 'N' }),
    E: ({ x, y }) => ({ x: x + 1, y: y + 0, heading: 'E' }),
    S: ({ x, y }) => ({ x: x + 0, y: y + 1, heading: 'S' }),
    W: ({ x, y }) => ({ x: x - 1, y: y + 0, heading: 'W' }),
  }

  const TURNS = {
    N: ['E', 'W'],
    E: ['N', 'S'],
    S: ['E', 'W'],
    W: ['N', 'S']
  }

  const check = sanity(500_000)
  const visited = new Set();
  const path = astar({
    neighbors: ({ x, y, heading }) => {
      const { dx, dy } = DELTAS[heading]

      return [
        { x: x + dx, y: y + dy, heading },
        ...(TURNS[heading].map(heading => ({ x, y, heading })))
      ].filter(({ x, y }) => {
        return lines[y]?.[x] !== '#'
      }).filter((neighbor) => {
        const str = JSON.stringify(neighbor)
        if (visited.has(str)) {
          return false;
        }
        visited.add(str);
        return true;
      }).flat()
    },
    h: ({ x, y }) => {
      return Math.abs(end.x - x) + Math.abs(end.y - y);
    },
    goal: ({ x, y }) => {
      return lines[y]?.[x] === 'E'
    },
    weight: ({ heading }, { heading: prevheading }) => {
      if (heading === prevheading) {
        return 1;
      }
      return 1000;
    },
    start,
    sanityCheck: check
  });

  return path.reduce((acc, step, i, data) => {
    if (i === 0) {
      return acc;
    }
    const prev = data[i - 1];
    if (step.heading !== prev.heading) {
      return acc + 1000;
    }
    return acc + 1
  }, 0)
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
