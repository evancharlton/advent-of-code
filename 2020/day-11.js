const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type);
  return lines;
};

const immediateNeighbors = (plane, r, c) => {
  const rowAbove = plane[r - 1] || [];
  const row = plane[r];
  const rowBelow = plane[r + 1] || [];

  const w = row[c - 1] || "L";
  const nw = rowAbove[c - 1] || "L";
  const n = rowAbove[c] || "L";
  const ne = rowAbove[c + 1] || "L";
  const e = row[c + 1] || "L";
  const se = rowBelow[c + 1] || "L";
  const s = rowBelow[c] || "L";
  const sw = rowBelow[c - 1] || "L";

  return [w, nw, n, ne, e, se, s, sw].reduce((acc, state) => {
    if (state === "#") {
      return acc + 1;
    }
    return acc;
  }, 0);
};

const visibleNeighbors = (plane, r, c) => {
  const row = plane[r];

  let n = ".";
  let ne = ".";
  let e = ".";
  let se = ".";
  let s = ".";
  let sw = ".";
  let w = ".";
  let nw = ".";

  let y = r;
  let x = c;

  // walk north
  y = r - 1;
  while (y >= 0 && n === ".") {
    n = (plane[y] || [])[c] || ".";
    y -= 1;
  }

  // walk south
  y = r + 1;
  while (y <= plane.length && s === ".") {
    s = (plane[y] || [])[c] || ".";
    y += 1;
  }

  // walk east
  x = c + 1;
  while (x < row.length && e === ".") {
    e = row[x] || ".";
    x += 1;
  }

  // walk west
  x = c - 1;
  while (x >= 0 && w === ".") {
    w = row[x] || ".";
    x -= 1;
  }

  // walk northeast
  x = c + 1;
  y = r - 1;
  while (x < row.length && y >= 0 && ne === ".") {
    ne = (plane[y] || [])[x] || ".";
    y -= 1;
    x += 1;
  }

  // walk southeast
  x = c + 1;
  y = r + 1;
  while (x < row.length && y <= plane.length && se === ".") {
    se = (plane[y] || [])[x] || ".";
    y += 1;
    x += 1;
  }

  // walk southwest
  x = c - 1;
  y = r + 1;
  while (x >= 0 && y <= plane.length && sw === ".") {
    sw = (plane[y] || [])[x] || ".";
    y += 1;
    x -= 1;
  }

  // walk northwest
  x = c - 1;
  y = r - 1;
  while (x >= 0 && y >= 0 && nw === ".") {
    nw = (plane[y] || [])[x] || ".";
    y -= 1;
    x -= 1;
  }

  const arr = { w, nw, n, ne, e, se, s, sw };
  return Object.values(arr).filter((v) => v === "#").length;
};

const tick = (alg, tolerance) => (plane) => {
  const next = [];
  let changes = 0;

  for (let r = 0; r < plane.length; r += 1) {
    next[r] = [];

    const row = plane[r];
    for (let c = 0; c < row.length; c += 1) {
      const seat = row[c];
      const neighbors = alg(plane, r, c);

      let state = seat;
      if (seat === ".") {
        // This is the floor
      } else if (seat === "L") {
        // Seat is empty
        if (neighbors === 0) {
          state = "#";
        }
      } else if (seat === "#") {
        // Seat is occupied
        if (neighbors >= tolerance) {
          // Corona mode activated
          state = "L";
        }
      }

      if (state !== seat) {
        changes += 1;
      }
      next[r][c] = state;
    }
    next[r] = next[r].join("");
  }

  return {
    next,
    changes,
  };
};

const occupied = (plane) => {
  return plane.reduce((acc, l) => {
    return (
      acc +
      l.split("").reduce((acc2, c) => {
        return acc2 + (c === "#" ? 1 : 0);
      }, 0)
    );
  }, 0);
};

const fillPlane = (plane) => {
  return plane.map((row) => row.replace(/L/g, "#"));
};

const toString = (plane) => {
  return plane.join("\n");
};

const part1 = (lines) => {
  const initial = fillPlane(lines);
  let changes = 1;
  let state = initial;
  let loops = 0;
  while (changes !== 0) {
    if (loops++ >= 10000) {
      throw new Error("Infinite loop");
    }
    const { next, changes: newChanges } = tick(immediateNeighbors, 4)(state);
    changes = newChanges;
    state = next;
  }

  return occupied(state);
};

const part2 = (lines) => {
  const initial = fillPlane(lines);
  let changes = 1;
  let state = initial;
  let loops = 0;
  while (changes !== 0) {
    if (loops++ >= 10000) {
      throw new Error("Infinite loop");
    }
    const { next, changes: newChanges } = tick(visibleNeighbors, 5)(state);
    changes = newChanges;
    state = next;
  }

  return occupied(state);
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  tick,
  part1,
  part2,
  toString,
  immediateNeighbors,
  visibleNeighbors,
};
