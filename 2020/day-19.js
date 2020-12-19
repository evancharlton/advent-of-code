const data = (type = "") => {
  const [rules, receivedMessages] = require("./input")(
    __filename,
    "\n\n",
    type
  );
  return [rules, receivedMessages.split("\n")];
};

const expandZeroRule = (block) => {
  const lines = block.split("\n").map((line) => line.replace(/"/g, ""));

  const rules = lines
    .map((line) => line.split(": "))
    .map(([id, spec]) => {
      let term = spec;
      if (spec.includes("|")) {
        term = spec
          .split(" | ")
          .map((v) => `(?:${v})`)
          .join("|");
      }
      return [id, `(?:${term})`];
    })
    .reduce((acc, [id, regex]) => ({ ...acc, [id]: regex }), {});

  while (rules["0"].match(/[\d]+/)) {
    Object.entries(rules)
      .filter(([id, regex]) => !regex.match(/[\d]/))
      .forEach(([id, regex]) => {
        Object.entries(rules)
          .filter(([otherId]) => id !== otherId)
          .forEach(([otherId, otherRegex]) => {
            const re = new RegExp(`\\b${id}\\b`, "g");
            if (!otherRegex.match(re)) {
              return;
            }
            rules[otherId] = otherRegex.replace(re, regex);
          });
      });
  }

  const zeroRule = rules["0"].replace(/ /g, "");
  return `^${zeroRule}$`;
};

const part1 = ([rules, messages]) => {
  const zeroRule = expandZeroRule(rules);
  const re = new RegExp(zeroRule);
  return messages.filter((message) => message.match(re)).length;
};

const part2 = (lines) => {
  return undefined;
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
