const lines = require("./input")(__filename);

const simulate = (deltaX, deltaY) => {
  let treeCount = 0;
  let x = 0;
  let y = 0;
  while (y < lines.length) {
    const row = lines[y];
    const slot = row[x];
    if (slot === "#") {
      treeCount += 1;
    }
    x = (x + deltaX) % row.length;
    y += deltaY;
  }
  return treeCount;
};

const values = [
  simulate(1, 1),
  simulate(3, 1),
  simulate(5, 1),
  simulate(7, 1),
  simulate(1, 2),
];

console.log(values.reduce((acc, v) => acc * v, 1));
