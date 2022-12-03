const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const score = (item) => {
  const charCode = item.charCodeAt(0);
  if (charCode <= "Z".charCodeAt(0)) {
    return charCode - "A".charCodeAt(0) + 27;
  }
  return charCode - "a".charCodeAt(0) + 1;
};

const part1 = (rucksacks) => {
  return rucksacks
    .map((sack) => {
      const first = sack.slice(0, sack.length / 2);
      const second = sack.slice(sack.length / 2);
      return [first, second];
    })
    .map(([first, second]) => {
      const firstSet = new Set(first);
      const secondSet = new Set(second);
      return [...firstSet].filter((s) => secondSet.has(s));
    })
    .flat()
    .map(score)
    .reduce((acc, n) => acc + n, 0);
};

const part2 = (rucksacks) => {
  if (rucksacks.length % 3 !== 0) {
    throw new Error("Unexpected number of rucksacks");
  }

  const badges = [];
  for (let i = 0; i < rucksacks.length; i += 3) {
    const first = rucksacks[i];
    const second = rucksacks[i + 1];
    const third = rucksacks[i + 2];

    const secondSet = new Set(second);
    const thirdSet = new Set(third);

    // Find the intersection of the three sets
    badges.push(
      ...new Set(
        first
          .split("")
          .filter((letter) => secondSet.has(letter) && thirdSet.has(letter))
      )
    );
  }
  return badges
    .flat()
    .map(score)
    .reduce((acc, n) => acc + n, 0);
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
