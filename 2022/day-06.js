const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const part1 = ([buffer]) => {
  const BUF_LENGTH = 4;
  for (let i = 0; i < buffer.length - BUF_LENGTH; i++) {
    const set = new Set(buffer.slice(i, i + BUF_LENGTH));
    if (set.size === BUF_LENGTH) {
      return i + BUF_LENGTH;
    }
  }
  throw new Error("Not found");
};

const part2 = ([buffer]) => {
  const BUF_LENGTH = 14;
  for (let i = 0; i < buffer.length - BUF_LENGTH; i++) {
    const set = new Set(buffer.slice(i, i + BUF_LENGTH));
    if (set.size === BUF_LENGTH) {
      return i + BUF_LENGTH;
    }
  }
  throw new Error("Not found");
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
