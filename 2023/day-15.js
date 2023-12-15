const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .filter(Boolean)
    .shift()
    .split(",");
};

const hash = (input) => {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    const v = `${input}`.charCodeAt(i);
    h += v;
    h *= 17;
    h %= 256;
  }
  return h;
};

const part1 = (input) => {
  return input
    .map((step) => {
      return hash(step);
    })
    .reduce((acc, v) => acc + v);
};

const DASH = /^([a-z]+)-$/;
const EQUALS = /^([a-z]+)=([0-9]+)$/;

const part2 = (input) => {
  const boxes = new Array(256);
  for (let i = 0; i < boxes.length; i += 1) {
    boxes[i] = [];
  }

  input.forEach((step) => {
    if (DASH.test(step)) {
      const [_, label] = step.match(DASH);
      const h = hash(label);
      boxes[h] = boxes[h].filter(([l]) => l !== label);
    } else if (EQUALS.test(step)) {
      const [_, label, length] = step.match(EQUALS);
      const h = hash(label);
      const index = boxes[h].findIndex(([l]) => l === label);
      if (index >= 0) {
        boxes[h][index] = [label, length];
      } else {
        boxes[h].push([label, length]);
      }
    } else {
      throw new Error(`Unknown input: ${step}`);
    }
  });
  return boxes
    .map((box, n) => {
      return box.map(([_, length], i) => {
        return length * (i + 1) * (n + 1);
      });
    })
    .flat(2)
    .reduce((acc, v) => acc + v);
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
