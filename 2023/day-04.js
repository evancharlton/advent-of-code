const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .filter(Boolean)
    .map((line) => {
      const [_, id, rest] = line.match(/^Card +(.+): (.+)/);
      const [winners, have] = rest.split("|").map((v) => v.trim());
      return {
        id,
        winners: winners
          .split(" ")
          .filter(Boolean)
          .map((v) => +v),
        have: have
          .split(" ")
          .filter(Boolean)
          .map((v) => +v),
      };
    });
};

const part1 = (cards) => {
  return cards
    .map(({ have, winners }) => {
      let v = 0;
      for (const num of have) {
        if (winners.includes(num)) {
          if (v === 0) {
            v = 1;
          } else {
            v *= 2;
          }
        }
      }
      return v;
    })
    .reduce((acc, v) => acc + v);
};

const part2 = (cards) => {
  const counts = cards.reduce((acc, { id }) => ({ ...acc, [id]: 1 }), {});

  cards.forEach(({ id, have, winners }) => {
    let matches = 0;
    for (const num of have) {
      if (winners.includes(num)) {
        matches += 1;
      }
    }

    for (let i = 1; i <= matches; i += 1) {
      const n = +id + i;
      if (!counts[n]) {
        console.debug(
          `Walked off the end of the table: ${id} + ${i} -> ${n} = ${
            counts[String(n)]
          }`,
          counts
        );
        break;
      }

      counts[n] += 1 * counts[+id];
    }
  });

  return Object.values(counts).reduce((acc, v) => acc + v);
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
