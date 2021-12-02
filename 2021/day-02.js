const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map((line) => {
    const [direction, amount] = line.split(" ");
    return { direction, amount: +amount };
  });
};

const part1 = (data) => {
  let x = 0;
  let y = 0;
  data.forEach(({ direction, amount }) => {
    switch (direction) {
      case "down":
        y += amount;
        break;
      case "up":
        y -= amount;
        break;
      case "forward":
        x += amount;
        break;
      default:
        throw new Error(`Unknown ${direction}`);
    }
  });
  return x * y;
};

const part2 = (data) => {
  return undefined;
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
};
