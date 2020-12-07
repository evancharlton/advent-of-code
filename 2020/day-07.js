const lines = require("./input")(__filename);

const MY_BAG = "shiny gold";

const bags = {};

lines.forEach((line) => {
  let [color, contents] = line.split(" bags contain ");

  if (contents === "no other bags.") {
    bags[color] = {
      color,
      contents: [],
    };
    return;
  }

  contents = contents
    .split(",")
    .map((s) => s.trim())
    .map((s) => s.replace(/\.$/, ""))
    .map((s) => s.replace(/ bags?$/, ""))
    .map((s) => {
      const [_, count, bag] = s.match(/^([\d+]+) (.*)$/);
      return {
        count,
        color: bag,
      };
    });

  bags[color] = {
    color,
    contents,
  };
});

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

console.log(parents.size);
