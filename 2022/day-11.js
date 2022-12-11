const monkeyMaker = (id, startItems, operation, throwItem) => {
  const monkey = {
    id,
    items: [...startItems],
    operation,
    throwItem,
    toString: function () {
      `Monkey ${id}: ${this.items.join(", ")}`;
    },
  };
  return monkey;
};

// Ugh, just stash it globally for now.
let lcm = 1;

const data = (type = "") => {
  const divisors = [];

  const monkeys = require("./input")(__filename, "\n\n", type).map((desc) => {
    const [idLine, startItemsLine, operationLine, testLine, yesLine, noLine] =
      desc.split("\n");
    const id = idLine.replace(/Monkey /, "").replace(":", "");
    const startItems = startItemsLine
      .replace(/.+Starting items: /, "")
      .split(", ")
      .map((v) => +v);
    const [op, value] = operationLine
      .replace(/.+Operation: new = old /, "")
      .split(" ");
    const operation = (item) => {
      const amount = value === "old" ? item : +value;

      switch (op) {
        case "+": {
          const out = (item % lcm) + amount;
          // console.debug(`    Worry level increases by ${value} to ${out}`);
          return out;
        }
        case "*": {
          const out = (item % lcm) * amount;
          // console.debug(`    Worry level is multiplied by ${value} to ${out}`);
          return out;
        }
        default:
          throw new Error("Unknown operation: " + op);
      }
    };

    const testNum = Number(testLine.replace(/.+Test: divisible by /, ""));
    const yes = yesLine.replace(/.+If true: throw to monkey /, "");
    const no = noLine.replace(/.+If false: throw to monkey /, "");

    divisors.push(testNum);

    const throwItem = (itemWorryLevel) => {
      if (itemWorryLevel % testNum === 0) {
        return yes;
      }
      return no;
    };
    return monkeyMaker(id, startItems, operation, throwItem);
  });
  const monkeyMap = monkeys.reduce(
    (acc, monkey) => ({ ...acc, [monkey.id]: monkey }),
    {}
  );

  lcm = divisors.reduce((a, b) => a * b, 1);

  return monkeyMap;
};

const rounds = (monkeyMap, count, relief) => {
  const inspectionCounts = {};
  for (let i = 0; i < count; i++) {
    const monkeyIds = Object.keys(monkeyMap).sort((a, b) => +a - +b);
    monkeyIds
      .map((monkeyId) => monkeyMap[monkeyId])
      .forEach((monkey) => {
        const items = [...monkey.items];
        monkey.items = [];

        const lines = [];
        lines.push(`Monkey ${monkey.id}: ${items.join(", ")}`);

        items.forEach((item) => {
          lines.push(
            `  Monkey inspects an item with a worry level of ${item}.`
          );
          inspectionCounts[monkey.id] = (inspectionCounts[monkey.id] || 0) + 1;

          const inspected = monkey.operation(item);
          lines.push(`    Worry level after inspection is ${inspected}.`);

          const unbroken = relief(inspected);
          lines.push(
            `    Monkey gets bored with item. Worry level is now ${unbroken}.`
          );

          const target = monkey.throwItem(unbroken);
          lines.push(
            `    Item with worry level ${unbroken} is thrown to monkey ${target}.`
          );

          monkeyMap[target].items.push(unbroken);
        });

        // console.debug(lines.join("\n"));
      });
  }
  return inspectionCounts;
};

const monkeyBusiness = (inspectionCounts) => {
  const [top, top1] = Object.values(inspectionCounts).sort((a, b) => b - a);
  return top * top1;
};

const part1 = (monkeys) => {
  return monkeyBusiness(rounds(monkeys, 20, (item) => Math.floor(item / 3)));
};

const part2 = (monkeys) => {
  return monkeyBusiness(rounds(monkeys, 10000, (item) => item));
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  rounds,
};
