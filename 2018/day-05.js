const data = (type = "") => {
  return require("./input")(__filename, "\n", type).join("");
};

const poles = (a, b) => {
  return a !== b && a.toUpperCase() === b.toUpperCase();
};

const react = (input) => {
  const skips = new Uint8Array(input.length);
  let skipped = 0;
  for (let i = 0; i < input.length - 1; i += 1) {
    const a = input[i];
    const b = input[i + 1];
    if (poles(a, b)) {
      skips[i] = 1;
      skips[i + 1] = 1;
      i += 1;
      skipped += 1;
    }
  }

  if (skipped === 0) {
    return input;
  }

  return react(
    input
      .split("")
      .filter((_, i) => !skips[i])
      .join("")
  );
};

const part1 = (input) => {
  return react(input).length;
};

const part2 = (input) => {
  const replacements = [...new Set(input.toUpperCase().split(""))];
  const shortestPolymer = replacements.reduce((shortest, replacement) => {
    const replacer = new RegExp(replacement, "ig");
    const replaced = input.replace(replacer, "");
    const reacted = react(replaced);
    if (reacted.length < shortest.length) {
      return reacted;
    }
    return shortest;
  }, input);
  return shortestPolymer.length;
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
