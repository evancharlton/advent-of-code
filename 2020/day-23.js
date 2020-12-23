const data = (type = "") => {
  const lines = require("./input")(__filename, "", type).map(Number);
  return lines;
};

const play = (numbers, cups, limit) => {
  const { pointers, start } = generatePointers(numbers, cups);
  const picked = new Set();

  let current = pointers.get(start);

  let turn = 0;
  while (turn++ < limit) {
    const a = pointers.get(current);
    const b = pointers.get(a);
    const c = pointers.get(b);
    const next = pointers.get(c);

    picked.clear();
    picked.add(a);
    picked.add(b);
    picked.add(c);

    let destination = current;
    while (true) {
      if (
        !picked.has(destination) &&
        pointers.has(destination) &&
        destination !== current
      ) {
        break;
      }
      destination -= 1;
      if (destination === 0) {
        destination = pointers.size;
      }
    }

    pointers.set(c, pointers.get(destination));
    pointers.set(destination, a);
    pointers.set(current, next);

    current = next;
  }
  return pointers;
};

const part1 = (numbers, limit = 100) => {
  const pointers = play(numbers, numbers.length, limit);

  const out = [];
  let current = pointers.get(1);
  while (current !== 1) {
    out.push(current);
    current = pointers.get(current);
  }

  return out.join("");
};

const part2 = (numbers) => {
  const pointers = play(numbers, 1_000_000, 10_000_000);

  const first = pointers.get(1);
  const second = pointers.get(first);
  return first * second;
};

const generatePointers = (numbers, items) => {
  const pointers = new Map();
  numbers.forEach((c, i, arr) => {
    pointers.set(c, arr[i + 1]);
  });

  let last = numbers[numbers.length - 1];
  let current = Math.max(...numbers) + 1;
  while (pointers.size < items - 1) {
    pointers.set(last, current);
    last = current;
    current += 1;
  }
  pointers.set(last, numbers[0]);
  return { pointers, start: last };
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  // console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
