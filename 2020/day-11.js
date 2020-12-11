const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type);
  return lines;
};

const tick = (plane) => {
  const next = [];
  let changes = 0;

  for (let r = 0; r < plane.length; r += 1) {
    next[r] = [];

    const rowAbove = plane[r - 1] || [];
    const row = plane[r];
    const rowBelow = plane[r + 1] || [];
    for (let c = 0; c < row.length; c += 1) {
      const seat = row[c];

      const w = row[c - 1] || "L";
      const nw = rowAbove[c - 1] || "L";
      const n = rowAbove[c] || "L";
      const ne = rowAbove[c + 1] || "L";
      const e = row[c + 1] || "L";
      const se = rowBelow[c + 1] || "L";
      const s = rowBelow[c] || "L";
      const sw = rowBelow[c - 1] || "L";

      const neighbors = [w, nw, n, ne, e, se, s, sw].reduce((acc, state) => {
        if (state === "#") {
          return acc + 1;
        }
        return acc;
      }, 0);

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
        if (neighbors >= 4) {
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
  while (changes !== 0) {
    const { next, changes: newChanges } = tick(state);
    changes = newChanges;
    state = next;
    // console.log(state.map((l) => l.join("")).join("\n"));
  }

  return occupied(state);
};

const part2 = (lines) => {
  return undefined;
};

if (!process.argv.includes("--watch")) {
  console.log(part1(data(process.argv[2] || "")));
}

module.exports = {
  data,
  tick,
  part1,
  part2,
  toString,
};
