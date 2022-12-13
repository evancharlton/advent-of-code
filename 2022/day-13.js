const data = (type = "") => {
  return require("./input")(__filename, "\n\n", type)
    .map((lines) => lines.trim())
    .filter((lines) => !!lines)
    .map((lines, j) => {
      const [left, right] = lines.split("\n").map((line, i) => {
        try {
          return JSON.parse(line);
        } catch (e) {
          console.debug(`Failed to parse @ ${j} / ${i}`, line);
          throw e;
        }
      });
      return { left, right };
    });
};

const correctOrder = (left, right, debug = false) => {
  debug && console.debug("correctOrder", left, "vs", right);
  if (typeof left === "number" && typeof right === "number") {
    if (left === right) {
      return "continue";
    }

    return left < right;
  }

  if (typeof left === "number" && Array.isArray(right)) {
    return correctOrder([left], right);
  }

  if (Array.isArray(left) && typeof right === "number") {
    return correctOrder(left, [right]);
  }

  if (!Array.isArray(left) || !Array.isArray(right)) {
    throw new Error("Invalid input");
  }

  for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
    const l = left[i];
    const r = right[i];

    if (l === undefined) {
      return true;
    } else if (r === undefined) {
      return false;
    }

    const result = correctOrder(l, r);
    if (result === "continue") {
      continue;
    } else if (result === true || result === false) {
      return result;
    }
    throw new Error("Invalid result: " + result);
  }

  if (left.length === right.length) {
    return "continue";
  }

  console.warn("Walked off the end of", left, right);
  throw new Error("hmmm");
};

const part1 = (pairs) => {
  return pairs.reduce((acc, { left, right }, i) => {
    const result = correctOrder(left, right);
    if (result === true) {
      // console.debug(`correct @ ${i + 1}`, left, right);
      return acc + i + 1;
    } else if (result === false) {
      return acc;
    } else {
      throw new Error("Invalid result: " + result);
    }
  }, 0);
};

const part2 = (pairs) => {
  const allPackets = [];
  pairs.forEach(({ left, right }) => {
    allPackets.push(left);
    allPackets.push(right);
  });
  allPackets.push([[2]], [[6]]);
  const sorted = allPackets.sort((a, b) => {
    const result = correctOrder(a, b);
    if (result === true) {
      return -1;
    } else if (result === false) {
      return 1;
    } else {
      return 0;
    }
  });
  const twoIndex =
    allPackets.findIndex((p) => JSON.stringify(p) === "[[2]]") + 1;
  const sixIndex =
    allPackets.findIndex((p) => JSON.stringify(p) === "[[6]]") + 1;
  return twoIndex * sixIndex;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  correctOrder,
  data,
  part1,
  part2,
};
