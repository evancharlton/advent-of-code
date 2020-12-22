const data = (type = "") => {
  return require("./input")(__filename, "\n\n", type).map(
    (grouping) =>
      grouping
        .split("\n") // line-by-line
        .slice(1) // skip the header row
        .map(Number) // make them numbers, not strings
  );
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

const combat = (player1, player2) => {
  const records = new Set();

  while (player1.length > 0 && player2.length > 0) {
    const checksum = `${player1.join(",")} vs ${player2.join(",")}`;

    const a = player1.shift();
    const b = player2.shift();

    if (records.has(checksum)) {
      return [score(player1), 0];
    }
    records.add(checksum);

    let victor;
    let winningCard = Math.max(a, b);
    let losingCard = Math.min(a, b);
    if (a <= player1.length && b <= player2.length) {
      const [subA, subB] = combat(player1.slice(0, a), player2.slice(0, b));

      if (subA > subB) {
        victor = player1;
        winningCard = a;
        losingCard = b;
      } else {
        victor = player2;
        winningCard = b;
        losingCard = a;
      }
    } else {
      if (a > b) {
        victor = player1;
      } else {
        victor = player2;
      }
    }
    victor.push(winningCard, losingCard);
  }
  return [player1, player2].map(score);
};

const part2 = ([player1, player2]) => {
  return Math.max(...combat(player1, player2));
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  score,
  combat,
  part1,
  part2,
};
