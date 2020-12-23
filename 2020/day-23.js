const data = (type = "") => {
  return require("./input")(__filename, "", type).map(Number);
};

const play = (numbers, cups, moves) => {
  const pointers = generatePointers(numbers, cups);

  let [current] = pointers;

  let turn = 0;
  while (turn++ < moves) {
    const a = pointers[current];
    const b = pointers[a];
    const c = pointers[b];
    const next = pointers[c];

    let destination = current;
    while (true) {
      if (
        destination !== a &&
        destination !== b &&
        destination !== c &&
        destination !== current &&
        !!pointers[destination]
      ) {
        break;
      }
      destination -= 1;
      if (destination === 0) {
        destination = pointers.length;
      }
    }

    pointers[c] = pointers[destination];
    pointers[destination] = a;
    pointers[current] = next;

    current = next;
  }
  return pointers;
};

const part1 = (numbers, moves = 100) => {
  const pointers = play(numbers, numbers.length, moves);

  const out = [];
  let current = pointers[1];
  while (current !== 1) {
    out.push(current);
    current = pointers[current];
  }

  return out.join("");
};

const part2 = (numbers) => {
  const pointers = play(numbers, 1_000_000, 10_000_000);

  const first = pointers[1];
  const second = pointers[first];
  return first * second;
};

const generatePointers = (numbers, numberOfCups) => {
  const pointers = new Uint32Array(numberOfCups + 1);
  numbers.forEach((c, i) => {
    pointers[c] = numbers[i + 1];
  });

  let last = numbers[numbers.length - 1];
  let current = Math.max(...numbers) + 1;
  let cupsAdded = numbers.length - 1;
  while (cupsAdded < numberOfCups - 1) {
    pointers[last] = current;
    cupsAdded += 1;
    last = current;
    current += 1;
  }

  // Close the loop from the end to the first element
  pointers[last] = numbers[0];

  // The zeroth element is unused; let's add a redundant pointer to serve as the
  // starting point for processing
  pointers[0] = numbers[0];

  return pointers;
};

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
