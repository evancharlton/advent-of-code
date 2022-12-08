const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .filter((line) => !!line)
    .map((line) => line.split("").map((v) => +v));
};

const part1 = (trees) => {
  const visibleTrees = [];

  for (let row = 0; row < trees.length; row++) {
    const treeRow = trees[row];
    colLoop: for (let col = 0; col < treeRow.length; col++) {
      const height = treeRow[col];

      const marker = `${height} @ ${row},${col}`;

      if (
        row === 0 ||
        col === 0 ||
        row === trees.length - 1 ||
        col === treeRow.length - 1
      ) {
        visibleTrees.push(marker + " (edge)");
        continue colLoop;
      }

      // Visible from the West?
      if (trees[row].slice(0, col).every((v) => v < height)) {
        visibleTrees.push(marker + " (west)");
        continue colLoop;
      }

      // Visible from the East?
      if (trees[row].slice(col + 1).every((v) => v < height)) {
        visibleTrees.push(marker + " (east)");
        continue colLoop;
      }

      // Visible from the North?
      if (trees.slice(0, row).every((v) => v[col] < height)) {
        visibleTrees.push(marker + " (north)");
        continue colLoop;
      }

      // Visible from the South?
      if (trees.slice(row + 1).every((v) => v[col] < height)) {
        visibleTrees.push(marker + " (south)");
        continue colLoop;
      }

      // Otherwise, no.
    }
  }

  return visibleTrees.length;
};

const getScore = (trees, r, c) => {
  const treeRow = trees[r];
  const height = treeRow[c];

  // Viewing distance to the west
  let west = 0;
  for (let x = c - 1; x >= 0; x -= 1) {
    west += 1;
    if (treeRow[x] >= height) {
      break;
    }
  }

  // Viewing distance to the east
  let east = 0;
  for (let x = c + 1; x < treeRow.length; x += 1) {
    east += 1;
    if (treeRow[x] >= height) {
      break;
    }
  }

  // Viewing distance to the north
  let north = 0;
  for (let y = r - 1; y >= 0; y -= 1) {
    north += 1;
    if (trees[y][c] >= height) {
      break;
    }
  }

  // Viewing distance to the south
  let south = 0;
  for (let y = r + 1; y < trees.length; y += 1) {
    south += 1;
    if (trees[y][c] >= height) {
      break;
    }
  }

  const score = west * north * east * south;

  // console.debug(
  //   `${height} @ ${r},${c} : w=${west}, n=${north}, e=${east}, s=${south} = ${score}`
  // );

  return score;
};

const part2 = (trees) => {
  const scores = [];

  for (let row = 1; row < trees.length - 1; row++) {
    const treeRow = trees[row];
    for (let col = 1; col < treeRow.length - 1; col++) {
      scores.push(getScore(trees, row, col));
    }
  }

  return Math.max(...scores);
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  getScore,
};
