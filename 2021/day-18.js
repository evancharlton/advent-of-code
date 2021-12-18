const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

let globalId = 1;
const generateId = () => {
  return `node #${globalId++}`;
};

const findRootId = (tree) =>
  Object.values(tree).find(({ parentId }) => !parentId).id;

const print = (tree) => JSON.stringify(toArray(tree));

const parseTree = (pair) => {
  const tree = {};
  const parse = (pair, parentId, depth) => {
    const nodeId = generateId();
    const [left, right] = pair;
    const node = {
      id: nodeId,
      parentId,
      depth,
      left: Array.isArray(left) ? parse(left, nodeId, depth + 1) : left,
      right: Array.isArray(right) ? parse(right, nodeId, depth + 1) : right,
    };
    tree[nodeId] = node;
    return nodeId;
  };
  parse(pair, undefined, 1);
  return tree;
};

const addTrees = (left, right) => {
  const tree = { ...left, ...right };

  const newId = generateId();
  const pair = {
    id: newId,
    parentId: undefined,
    depth: 0,
    left: findRootId(left),
    right: findRootId(right),
  };
  tree[newId] = pair;
  tree[pair.left].parentId = newId;
  tree[pair.right].parentId = newId;

  Object.keys(tree).forEach((key) => {
    tree[key].depth += 1;
  });

  return tree;
};

const findExplodingNode = (tree, currentId, lineage) => {
  if (typeof currentId === "number") {
    return undefined;
  }

  if (lineage.length >= 4) {
    return currentId;
  }

  const current = tree[currentId];
  return (
    findExplodingNode(tree, current.left, [...lineage, currentId]) ??
    findExplodingNode(tree, current.right, [...lineage, currentId])
  );
};

const findSplittingNode = (tree, currentId) => {
  if (typeof currentId === "number") {
    return undefined;
  }

  const { left, right } = tree[currentId];

  if (typeof left === "number" && left >= 10) {
    return currentId;
  }
  // Otherwise, left is a leaf, but *NOT* split-worthy.

  if (typeof left === "string") {
    // It's a branch; keep going.
    const leftSplit = findSplittingNode(tree, left);
    if (leftSplit) {
      return leftSplit;
    }
    // There was no split to the left.
  }

  if (typeof right === "number" && right >= 10) {
    // We should split on this node.
    return currentId;
  }

  // Last-ditch effort: look right.
  return findSplittingNode(tree, right);
};

const explodeTree = (original) => {
  // Find a pair to explode
  const rootId = findRootId(original);
  const explodingId = findExplodingNode(original, rootId, []);

  if (!explodingId) {
    return original;
  }

  const tree = JSON.parse(JSON.stringify(original));

  // console.log(print(tree));

  const explodingPair = tree[explodingId];
  const parent = tree[explodingPair.parentId];

  const { left, right } = explodingPair;

  // console.log(`Exploding ${explodingId}: [${left}, ${right}]`);

  const rightMost = (subtreeRootId) => {
    const subtreeRoot = tree[subtreeRootId];
    if (typeof subtreeRoot.right === "number") {
      return { id: subtreeRoot.id, side: "right" };
    }
    return rightMost(subtreeRoot.right);
  };

  // Find a home for the left value.
  {
    // console.log(`Looking for a home for the left value (${left})`);

    const { id, side } = (() => {
      const visited = new Set([explodingId]);
      const queue = [parent.id];
      while (queue.length > 0) {
        const pairId = queue.shift();
        if (!pairId) {
          // We've walked beyond the end of the tree. At this point, we don't
          // do anything.
          break;
        }

        if (visited.has(pairId)) {
          continue;
        }
        visited.add(pairId);

        const pair = tree[pairId];
        if (typeof pair.left === "number") {
          return { id: pairId, side: "left" };
        }

        if (visited.has(pair.left)) {
          // We are in a chain of left-hand children; we must continue to go up.
          queue.push(pair.parentId);
        } else {
          // We have *not* visited this node before. This is a left-hand branch
          // and we need to extract the rightmost subtree from this.
          return rightMost(pair.left);
        }
      }

      return { id: undefined, side: undefined };
    })();

    if (id) {
      if (typeof tree[id][side] !== "number") {
        console.error(
          `===== tree[${id}][${side}] (${typeof tree[id][side]}) =====`
        );
        console.error(JSON.stringify(tree, null, 2));
        throw new Error("Cannot add a number to a pair");
      }
      // console.log(`tree[${id}][${side}] =`, tree[id][side], "+", left);
      tree[id][side] += left;
    } else {
      // console.log("No home found.");
    }
  }

  // Find a home for the right value.
  {
    // console.log(`Looking for a home for the right value (${right})`);

    const { id, side } = (() => {
      const visited = new Set([explodingId]);
      const queue = [parent.id];

      const leftMost = (subtreeRootId) => {
        const subtreeRoot = tree[subtreeRootId];
        if (typeof subtreeRoot.left === "number") {
          return { id: subtreeRoot.id, side: "left" };
        }
        return leftMost(subtreeRoot.left);
      };

      while (queue.length > 0) {
        const pairId = queue.shift();
        if (!pairId) {
          // We've walked beyond the end of the tree. At this point, we don't
          // do anything.
          break;
        }

        if (visited.has(pairId)) {
          continue;
        }
        visited.add(pairId);

        const pair = tree[pairId];
        // console.log(`Looking at ${pairId}`, pair);
        if (typeof pair.right === "number") {
          return { id: pairId, side: "right" };
        }

        if (visited.has(pair.right)) {
          // We are in a chain of left-hand children; we must continue to go up.
          queue.push(pair.parentId);
        } else {
          // We have *not* visited this node before. This is a left-hand branch
          // and we need to extract the rightmost subtree from this.
          return leftMost(pair.right);
        }
      }
      return { id: undefined, side: undefined };
    })();

    if (id) {
      if (typeof tree[id][side] !== "number") {
        console.error(
          `===== tree[${id}][${side}] (${typeof tree[id][side]}) =====`
        );
        console.error(JSON.stringify(tree, null, 2));
        throw new Error("Cannot add a number to a pair");
      }
      // console.log(`tree[${id}][${side}] =`, tree[id][side], "+", right);
      tree[id][side] += right;
    } else {
      // console.log("No home found.");
    }
  }

  // The exploded pair becomes a 0 in its parent.
  const explodingPairSide = parent.left === explodingId ? "left" : "right";
  tree[parent.id][explodingPairSide] = 0;
  delete tree[explodingId];
  return tree;
};

const splitTree = (original) => {
  const splittingNodeKey = findSplittingNode(original, findRootId(original));
  if (!splittingNodeKey) {
    return original;
  }

  const tree = JSON.parse(JSON.stringify(original));

  const node = tree[splittingNodeKey];
  if (typeof node.left === "number" && node.left >= 10) {
    const newId = generateId();
    tree[newId] = {
      id: newId,
      parentId: node.id,
      depth: node.depth + 1,
      left: Math.floor(node.left / 2),
      right: Math.ceil(node.left / 2),
    };
    node.left = newId;
  } else if (typeof node.right === "number" && node.right >= 10) {
    const newId = generateId();
    tree[newId] = {
      id: newId,
      parentId: node.id,
      depth: node.depth + 1,
      left: Math.floor(node.right / 2),
      right: Math.ceil(node.right / 2),
    };
    node.right = newId;
  } else {
    return original;
  }

  return tree;
};

const toArray = (tree, rootId = undefined) => {
  const serialize = (childId) => {
    if (typeof childId === "number") {
      return childId;
    }

    const pair = tree[childId];
    if (!pair) {
      console.error(`Could not find [${childId}]`);
      console.error(JSON.stringify(tree, null, 2));
      throw new Error(`Missing key: ${childId}`);
    }
    return [serialize(pair.left), serialize(pair.right)];
  };

  return serialize(rootId ?? findRootId(tree));
};

const sumTrees = (trees) => {
  let i = 0;
  do {
    // console.log(`${trees.length} things to do`);
    const left = trees.shift();
    const right = trees.shift();

    // console.log(`  ${print(left)}`);
    // console.log(`+ ${print(right)}`);

    const added = addTrees(left, right);
    let ongoing = added;

    let reducingSet = ongoing;
    do {
      let performedExplosions = false;
      reducingSet = ongoing;
      do {
        let exploded = explodeTree(ongoing);
        performedExplosions = exploded !== ongoing;
        // if (performedExplosions) {
        //   console.log("\texplosion!");
        //   console.log("\t =>", print(ongoing));
        //   console.log("\t <=", print(exploded));
        // }
        ongoing = exploded;
      } while (performedExplosions);

      let splits = splitTree(ongoing);
      letperformedSplits = splits !== ongoing;
      // if (splits !== ongoing) {
      //   console.log("\tsplit!");
      //   console.log("\t =>", print(ongoing));
      //   console.log("\t <=", print(splits));
      // }
      ongoing = splits;
    } while (reducingSet !== ongoing);

    // console.log(`= ${print(ongoing)}`);
    trees.unshift(ongoing);
  } while (trees.length > 1);

  return trees.shift();
};

const calculateMagnitude = (tree, rootId = undefined) => {
  if (rootId === undefined) {
    return calculateMagnitude(tree, findRootId(tree));
  }
  if (typeof rootId === "number") {
    return rootId;
  }
  const node = tree[rootId];
  return (
    3 * calculateMagnitude(tree, node.left) +
    2 * calculateMagnitude(tree, node.right)
  );
};

const part1 = (data) => {
  const trees = data
    .map((line) => JSON.parse(line))
    .map((pair) => parseTree(pair));

  return calculateMagnitude(sumTrees(trees));
};

const part2 = (data) => {
  const trees = data
    .map((line) => JSON.parse(line))
    .map((pair) => parseTree(pair));
  let highest = 0;

  for (let i = 0; i < trees.length; i += 1) {
    for (let j = 0; j < trees.length; j += 1) {
      if (i === j) {
        continue;
      }
      const pair = [
        JSON.parse(JSON.stringify(trees[i])),
        JSON.parse(JSON.stringify(trees[j])),
      ];

      highest = Math.max(highest, calculateMagnitude(sumTrees(pair)));
    }
  }

  return highest;
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  addTrees,
  parseTree,
  explodeTree,
  splitTree,
  toArray,
  sumTrees,
  calculateMagnitude,
};
