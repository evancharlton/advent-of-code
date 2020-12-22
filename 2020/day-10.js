const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type).map(Number);
  lines.sort((a, b) => a - b);
  return lines;
};

const part1 = (data) => {
  let joltage = 0;
  const spreads = {};
  while (data.length > 0) {
    const next = data.shift();
    const difference = next - joltage;
    if (difference > 3 || difference < 1) {
      console.warn(`${next} is incompatible with ${joltage}`);
      break;
    }

    joltage = next;
    spreads[difference] = (spreads[difference] || 0) + 1;
  }

  // Account for the device itself
  joltage += 3;
  spreads[3] = spreads[3] + 1;

  return spreads[1] * spreads[3];
};

const part2 = (data) => {
  data.unshift(0);

  const runs = [];
  let run = [];
  for (let i = 0; i < data.length; i += 1) {
    const curr = data[i];
    const next = data[i + 1];
    const breakpoint = next - curr === 3;
    run.push(curr);

    if (breakpoint) {
      // This is the end of a run; save it away.
      runs.push([...run]);
      run = [];
    }
  }

  if (run.length > 0) {
    runs.push([...run]);
  }

  const isValid = (list) => {
    for (let i = 1; i < list.length; i += 1) {
      if (list[i] - list[i - 1] > 3) {
        return false;
      }
    }
    return true;
  };

  // Yanked from SO
  const powerset = (l) => {
    return (function ps(list) {
      if (list.length === 0) {
        return [[]];
      }
      var head = list.pop();
      var tailPS = ps(list);
      return tailPS.concat(
        tailPS.map(function (e) {
          return [head].concat(e);
        })
      );
    })(l.slice()).sort((a, b) => a - b);
  };

  const bruteforce = (list) => {
    const innerSet = list.slice(1, list.length - 1);
    return powerset(innerSet).reduce((acc, set) => {
      const paddedSet = [list[0], ...set, list[list.length - 1]].sort(
        (a, b) => a - b
      );
      const valid = isValid(paddedSet);
      if (valid) {
        return acc + 1;
      }
      return acc;
    }, 0);
  };

  const relevant = runs.filter((r) => r.length > 2);
  const out = relevant.reduce((acc, r) => {
    return acc * bruteforce(r);
  }, 1);
  return out;
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = { data, part1, part2 };
