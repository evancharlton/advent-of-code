const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const part1 = (lines) => {
  return lines
    .filter(Boolean)
    .map((line) => {
      const [_, id, data] = line.match(/^Game ([\d]+): (.+)$/);
      const hands = data.split(";").map((info) =>
        info.split(",").reduce((acc, cubes) => {
          const [num, color] = cubes.trim().split(" ");
          return {
            ...acc,
            [color]: +num,
          };
        }, {})
      );
      return { id, hands };
    })
    .filter(({ hands }) => {
      return hands.every(({ red = 0, green = 0, blue = 0 }) => {
        return red <= 12 && green <= 13 && blue <= 14;
      });
    })
    .map(({ id }) => +id)
    .reduce((acc, v) => acc + v);
};

const part2 = (lines) => {
  return lines
    .filter(Boolean)
    .map((line) => {
      const [_, id, data] = line.match(/^Game ([\d]+): (.+)$/);
      const hands = data.split(";").map((info) =>
        info.split(",").reduce((acc, cubes) => {
          const [num, color] = cubes.trim().split(" ");
          return {
            ...acc,
            [color]: +num,
          };
        }, {})
      );
      return { id, hands };
    })
    .map((info) => {
      return info.hands.reduce(
        (acc, { red = 0, green = 0, blue = 0 }) => {
          return {
            red: Math.max(acc.red, red),
            green: Math.max(acc.green, green),
            blue: Math.max(acc.blue, blue),
          };
        },
        { red: 0, green: 0, blue: 0 }
      );
    })
    .map(({ red = 0, green = 0, blue = 0 }) => {
      return red * green * blue;
    })
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
