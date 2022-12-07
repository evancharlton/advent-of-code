const parseTree = (lines) => {
  const tree = {
    name: "<root>",
    files: {},
    dirs: {},
    parent: null,
  };

  let currentNode = tree;

  for (
    let i = 1; // We know we start with /
    i < lines.length;
    i++
  ) {
    const line = lines[i];

    if (line.startsWith("$ cd")) {
      // Find where we're going
      const dir = line.replace(/\$ cd /, "");
      if (dir === "..") {
        currentNode = currentNode.parent;
      } else {
        currentNode = currentNode.dirs[dir];
      }
      continue;
    }

    if (line === "$ ls") {
      // Scan forward until we find the next command
      const output = [];
      let j = Number.MAX_VALUE;
      for (j = i + 1; j < lines.length; j++) {
        const line = lines[j];
        if (line.startsWith("$")) {
          break;
        }
        output.push(line);
      }
      i = j - 1;

      output.forEach((ls) => {
        const [info, name] = ls.split(" ");
        if (info === "dir") {
          currentNode.dirs[name] = {
            name,
            parent: currentNode,
            files: {},
            dirs: {},
          };
        } else {
          currentNode.files[name] = +info;
        }
      });
      continue;
    }

    throw new Error("Unexpected line: " + line);
  }
  return tree;
};

const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type);
  return parseTree(lines);
};

const DISK_CAPACITY = 70000000;
const REQUIRED_SPACE = 30000000;

const sizeOf = (node) => {
  const files = Object.values(node.files).reduce((a, b) => a + b, 0);
  const dirs = Object.values(node.dirs).reduce((a, b) => a + sizeOf(b), 0);
  return files + dirs;
};

const part1 = (tree) => {
  const nodes = [];
  const queue = [tree];
  while (queue.length > 0) {
    const node = queue.shift();
    queue.push(...Object.values(node.dirs));
    const size = sizeOf(node);
    if (size <= 100000) {
      nodes.push(node);
    }
  }

  return nodes.reduce((acc, n) => acc + sizeOf(n), 0);
};

const part2 = (tree) => {
  const sizes = [];
  const queue = [tree];
  while (queue.length > 0) {
    const node = queue.shift();
    queue.push(...Object.values(node.dirs));
    const size = sizeOf(node);
    sizes.push(size);
  }

  const currentSpace = sizeOf(tree);
  const currentFree = DISK_CAPACITY - currentSpace;

  return sizes
    .sort((a, b) => a - b)
    .filter((size) => currentFree + size >= REQUIRED_SPACE)[0];
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
