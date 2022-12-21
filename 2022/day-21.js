const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .filter(Boolean)
    .map((line) => {
      const [, monkeyId, rest] = line.match(/^(.+): (.+)$/);
      if (/^[0-9]+$/.test(rest)) {
        return { id: monkeyId, value: +rest, type: "num" };
      }

      const [, left, op, right] = rest.match(/^(.+) (.) (.+)$/);
      return {
        id: monkeyId,
        value: undefined,
        type: "op",
        left,
        op,
        right,
      };
    });
};

const operate = (leftValue, op, rightValue) => {
  switch (op) {
    case "+":
      return leftValue + rightValue;
    case "-":
      return leftValue - rightValue;
    case "*":
      return leftValue * rightValue;
    case "/":
      return leftValue / rightValue;
    case "=":
      return leftValue === rightValue
        ? "=="
        : leftValue > rightValue
        ? ">"
        : "<";
    default:
      throw new Error(`Unknown operation: ${leftValue} ${op} ${rightValue}`);
  }
};

const part1 = (monkeys) => {
  const results = new Map();
  while (monkeys.length) {
    const monkey = monkeys.shift();
    const { id, type, value, left, right, op } = monkey;
    if (type === "num" && value !== undefined) {
      results.set(id, value);
      continue;
    }

    const leftValue = results.get(left);
    const rightValue = results.get(right);
    if (leftValue === undefined || rightValue === undefined) {
      monkeys.push(monkey);
      continue;
    }

    results.set(id, operate(leftValue, op, rightValue));
  }

  return results.get("root");
};

const part2 = (originalMonkeys) => {
  const solve = (humn) => {
    const monkeys = originalMonkeys.map((monkey) => {
      if (monkey.id === "root") {
        monkey.op = "=";
      } else if (monkey.id === "humn") {
        monkey.value = humn;
      }
      return monkey;
    });
    const results = new Map();
    while (monkeys.length) {
      const monkey = monkeys.shift();
      const { id, type, value, left, right, op } = monkey;
      if (type === "num" && value !== undefined) {
        results.set(id, value);
        continue;
      }

      const leftValue = results.get(left);
      const rightValue = results.get(right);
      if (leftValue === undefined || rightValue === undefined) {
        monkeys.push(monkey);
        continue;
      }

      results.set(id, operate(leftValue, op, rightValue));
    }
    return results.get("root");
  };

  // Search for the inflection point
  let lowerLimit = 1;
  let upperLimit = 1;
  let lastResult = undefined;
  while (true) {
    const result = solve(upperLimit);
    if (lastResult === undefined) {
      lastResult = result;
      continue;
    }

    if (lastResult === result) {
      lowerLimit = upperLimit;
      upperLimit *= 2;
      continue;
    }

    break;
  }

  // Binary search to find the right value
  const lowerResult = solve(lowerLimit);
  const upperResult = solve(upperLimit);
  const range = [lowerLimit, upperLimit];
  while (true) {
    const delta = range[1] - range[0];
    const midpoint = range[0] + Math.floor(delta / 2);
    const result = solve(midpoint);
    if (result === lowerResult) {
      range[0] = midpoint;
    } else if (result === upperResult) {
      range[1] = midpoint;
    } else {
      return midpoint;
    }
  }
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
