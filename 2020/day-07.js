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
        count: +count,
        color: bag,
      };
    });

  bags[color] = {
    color,
    contents,
  };
});

const countBags = (color) => {
  const { contents } = bags[color];
  return contents.reduce((acc, { count, color }) => {
    return acc + count + count * countBags(color);
  }, 0);
};

console.log(countBags(MY_BAG, 1));
