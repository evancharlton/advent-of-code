const readLines = require("../read-input");

const TEST = `
....#
#..#.
#..##
..#..
#....
`
  .trim()
  .split("\n");

const bug = v => v === "#";

const tick = layout => {
  const next = [];
  for (let r = 0; r < layout.length; r += 1) {
    const row = [];
    for (let c = 0; c < layout[r].length; c += 1) {
      const n = (layout[r - 1] || [])[c];
      const e = layout[r][c + 1];
      const s = (layout[r + 1] || [])[c];
      const w = layout[r][c - 1];
      const curr = layout[r][c];

      const neighborBugs = [n, e, s, w].reduce((tot, v) => {
        return tot + (bug(v) ? 1 : 0);
      }, 0);

      if (bug(curr)) {
        if (neighborBugs !== 1) {
          // The bug dies.
          row.push(".");
        } else {
          // The bug lives.
          row.push("#");
        }
      } else {
        if (neighborBugs === 1 || neighborBugs === 2) {
          // Infested
          row.push("#");
        } else {
          // Nothing changes.
          row.push(".");
        }
      }
    }
    next.push(row);
  }
  return next;
};

const print = layout => {
  return layout.map(row => row.join(" ")).join("\n");
};

readLines("./day-24/input")
  .then(lines => {
    const layout = lines.map(line => line.split(""));
    return layout;
  })
  .then(layout => {
    const layouts = {};
    let curr = layout;
    let i = 0;
    while (true) {
      const next = tick(curr);
      i += 1;
      const str = print(next);
      if (layouts[str]) {
        return next;
      }
      layouts[str] = i;
      curr = next;
    }
  })
  .then(layout => {
    // Flatten it
    const flattened = layout.reduce((acc, row) => {
      return [...acc, ...row];
    }, []);
    const biodiversity = flattened.reduce((acc, v, i) => {
      if (bug(v)) {
        return acc + Math.pow(2, i);
      }
      return acc;
    }, 0);
    return biodiversity;
  })
  .then(output => {
    if (output !== undefined) {
      if (Array.isArray(output) || typeof output === "object") {
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log(output);
      }
    }
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
