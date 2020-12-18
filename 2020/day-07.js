const data = (type = "") => {
  return require("./input")(__filename, "\n", type).reduce((acc, line) => {
    let [color, contents] = line.split(" bags contain ");

    if (contents === "no other bags.") {
      return {
        ...acc,
        [color]: {
          color,
          contents: [],
        },
      };
    }

    contents = contents
      .split(",")
      .map((s) => s.trim())
      .map((s) => s.replace(/\.$/, ""))
      .map((s) => s.replace(/ bags?$/, ""))
      .map((s) => {
        const [_, count, bag] = s.match(/^([\d+]+) (.*)$/);
        return {
          count: +count,
          color: bag,
        };
      });

    return {
      ...acc,
      [color]: {
        color,
        contents,
      },
    };
  }, {});
};

const MY_BAG = "shiny gold";

const part1 = (bags) => {
  const parents = new Set();
  const searches = [MY_BAG];

  while (searches.length > 0) {
    const search = searches.shift();

    const containers = Object.entries(bags)
      .filter(([_color, { contents }]) => {
        return contents.find(({ color: childColor }) => {
          return childColor === search;
        });
      })
      .map(([color]) => color);

    searches.push(...containers);
    containers.forEach((c) => parents.add(c));
  }

  return parents.size;
};

const part2 = (bags) => {
  const countBags = (color) => {
    const { contents } = bags[color];
    return contents.reduce((acc, { count, color }) => {
      return acc + count + count * countBags(color);
    }, 0);
  };

  return countBags(MY_BAG, 1);
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
