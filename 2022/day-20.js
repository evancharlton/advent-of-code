const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .filter((line) => line.length > 0)
    .map((v) => +v);
};

const print = (node) => {
  const out = [];

  const startNode = node.prev;
  let currentNode = startNode;
  do {
    out.push(currentNode.value);
    currentNode = currentNode.next;
  } while (startNode !== currentNode && out.length < 100);

  return [...out, ...out].join(", ");
};

const printArr = (nodes) => {
  return nodes
    .map(
      ({ value, prev, next }) =>
        `.. <-\t${prev.value}\t<-\t${value}\t->\t${next.value}\t-> ..`
    )
    .join("\n");
};

const part1 = (lines, decryptionKey = 1, times = 1) => {
  const nodes = lines
    .map((v) => ({
      prev: null,
      next: null,
      value: +v * decryptionKey,
      decrypted: +v * decryptionKey,
    }))
    .map((node, i, array) => {
      node.next = array[(i + 1) % array.length];
      node.prev = array[(i - 1 + array.length) % array.length];
      return node;
    });

  let zeroNode = null;
  for (let time = 0; time < times; time += 1) {
    nodes.forEach((current) => {
      const { prev: oldPrev, value, next: oldNext } = current;
      // Remove the current value
      oldPrev.next = oldNext;
      oldNext.prev = oldPrev;

      // console.debug(`Removed ${current.value}\t`, print(oldNext));

      let newNext = oldNext;
      let newPrev = oldPrev;
      if (value > 0) {
        for (let n = value % (lines.length - 1); n > 0; n -= 1) {
          newPrev = newNext;
          newNext = newNext.next;
        }
      } else if (value < 0) {
        for (let n = value % (lines.length - 1); n < 0; n += 1) {
          newNext = newPrev;
          newPrev = newPrev.prev;
        }
      } else if (value === 0) {
        zeroNode = current;
      }

      current.prev = newPrev;
      current.next = newNext;
      newNext.prev = current;
      newPrev.next = current;

      nodes.forEach((node, i) => {
        if (!node.next) {
          throw new Error(`${node.value} has no next`);
        }

        if (!node.prev) {
          throw new Error(`${node.value} has no previous`);
        }

        if (node.next === node) {
          throw new Error(`${node.value}.next points to itself @ ${i}`);
        }

        if (node.prev === node) {
          throw new Error(`${node.value}.prev points to itself @ ${i}`);
        }

        if (node.next.prev !== node) {
          throw new Error(
            `${node.value}.next points to ${node.next.prev.value}, not ${node.value}`
          );
        }

        if (node.prev.next !== node) {
          throw new Error(
            `${node.value}.prev points to ${node.prev.next.value}, not ${node.value}`
          );
        }
      });
    });
  }

  // console.log(print(zeroNode));

  let current = zeroNode;
  const coords = [];
  for (let i = 0; i <= 3000; i += 1) {
    if (i % 1000 === 0) {
      coords.push(current.value);
    }
    current = current.next;
  }
  return coords.reduce((acc, v) => acc + v, 0);
};

const part2 = (lines, times = 10) => {
  return part1(lines, 811589153, times);
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
