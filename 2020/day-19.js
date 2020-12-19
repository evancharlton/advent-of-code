const data = (type = "") => {
  const [rules, receivedMessages] = require("./input")(
    __filename,
    "\n\n",
    type
  );

  return [
    rules.split("\n").map((line) => line.replace(/"/g, "")),
    receivedMessages.split("\n"),
  ];
};

const expandZeroRule = (lines) => {
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

const part2 = ([oldRules, messages]) => {
  const rules = oldRules.map((line) => {
    if (line.startsWith("8: ")) {
      return "8: (?:42)+";
    }
    if (line.startsWith("11: ")) {
      const start = "(?:42)";
      const end = "(?:31)";
      let out = `11: `;
      let i = 0;
      while (i++ < 10) {
        for (let j = 0; j < i; j += 1) {
          out += `${start}`;
        }
        for (let j = 0; j < i; j += 1) {
          out += `${end}`;
        }
        out += "|";
      }
      out = out.substr(0, out.length - 1);
      return out;
    }
    return line;
  });

  const zeroRule = expandZeroRule(rules);
  const re = new RegExp(zeroRule);
  return messages.filter((message) => message.match(re)).sort().length;
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
