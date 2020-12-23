const data = (type = "") => {
  const lines = require("./input")(__filename, "", type).map(Number);
  return lines;
};

const getNextValue = (cups, current) => {
  const [lowest, highest] = minmax(cups);

  if (current === lowest) {
    return highest;
  }

  let c = current - 1;
  while (!cups.includes(c)) {
    c -= 1;
  }
  return c;
};

const debug = (...args) => {
  if (process.env.NODE_ENV === "test") return;
  console.log(...args);
};

const part1 = (numbers, limit = 100) => {
  let turn = 0;
  let cups = [...numbers];
  while (turn++ < limit) {
    debug(`-- move ${turn} --`);
    const [current, a, b, c, ...rest] = cups;
    const [next] = rest;
    const picked = [current, ...rest];
    debug(
      `cups: ${cups
        .map((c, i) => {
          if (i === 0) {
            return `(${c})`;
          }
          return c;
        })
        .join(" ")}`
    );
    debug(`pickup: ${a}, ${b}, ${c}`);

    const destination = getNextValue(picked, current);
    const destinationIndex = picked.indexOf(destination);
    debug(`destination: ${destination} @ ${destinationIndex}`);
    picked.splice(destinationIndex + 1, 0, a, b, c);

    const nextIndex = picked.indexOf(next);
    const before = picked.slice(0, nextIndex);
    const after = picked.slice(nextIndex);
    const nextArray = [...after, ...before];
    cups = nextArray;

    debug("");
  }

  const out = [];
  const oneIndex = cups.indexOf(1);
  for (let i = 1; i <= cups.length - 1; i += 1) {
    out.push(cups[(oneIndex + i) % cups.length]);
  }

  return out.join("");
};

const part2 = (input) => {
  return undefined;
};

const minmax = (cups) =>
  cups.reduce(([min, max], c) => [Math.min(min, c), Math.max(max, c)], [
    Number.MAX_SAFE_INTEGER,
    0,
  ]);

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
