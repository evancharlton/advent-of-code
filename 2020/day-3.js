const lines = require("./input")(__filename).split("\n");

const RIGHT = 3;

const treeCount = lines.reduce((acc, row, i) => {
  const offset = (i * RIGHT) % row.length;
  const slot = row[offset];
  if (slot === "#") {
    return acc + 1;
  }
  return acc;
}, 0);

console.log(treeCount);
