const data = (type = "") => {
  return require("./input")(__filename, "\n\n", type).map((grouping) => {
    const [name, ...deck] = grouping.split("\n");
    return deck.map(Number);
  });
};

const score = (hand1) => {
  const hand = [...hand1];
  let total = 0;
  for (let i = hand.length; i > 0; i -= 1) {
    const card = hand.shift();
    total += card * i;
  }
  return total;
};

const part1 = ([player1, player2]) => {
  while (player1.length > 0 && player2.length > 0) {
    const a = player1.shift();
    const b = player2.shift();
    if (a > b) {
      player1.push(a, b);
    } else {
      player2.push(b, a);
    }
  }

  return Math.max(...[player1, player2].map(score));
};

const part2 = (input) => {
  return undefined;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  score,
  part1,
  part2,
};
