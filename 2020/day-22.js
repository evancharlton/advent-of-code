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

const debug = (...args) => {
  if (false && process.env.NODE_ENV !== "test") {
    console.log(...args);
  }
};

const combat = (game, player1, player2) => {
  const records = new Map();
  debug();
  debug(`=== Game ${game} ===`);
  let subgames = game + 1;

  let round = 0;
  while (round++ < 100000 && player1.length > 0 && player2.length > 0) {
    debug();
    debug(`-- Round ${round} (Game ${game}) --`);
    debug(`Player 1's deck: ${player1.join(", ")}`);
    debug(`Player 2's deck: ${player2.join(", ")}`);

    const checksum = `${player1.join(",")} vs ${player2.join(",")}`;

    const a = player1.shift();
    const b = player2.shift();

    debug(`Player 1 plays: ${a}`);
    debug(`Player 2 plays: ${b}`);

    // Check for this history
    if (records.has(checksum)) {
      debug(
        `${a} vs ${b} has come up before (during Game ${game} in Round ${records.get(
          checksum
        )})`
      );
      return [score(player1), 0];
    }
    records.set(checksum, round);

    let victor;
    const cards = [];
    if (a <= player1.length && b <= player2.length) {
      debug(`Playing a sub-game to determine the winner...`);
      const [subA, subB] = combat(
        subgames++,
        player1.slice(0, a),
        player2.slice(0, b)
      );
      debug(`...anyway, back to game ${game}`);

      if (subA > subB) {
        victor = player1;
        debug(`Player 1 wins round ${round} of game ${game}!`);
        cards.push(a, b);
      } else {
        victor = player2;
        debug(`Player 2 wins round ${round} of game ${game}!`);
        cards.push(b, a);
      }
    } else {
      if (a > b) {
        victor = player1;
        debug(`Player 1 wins round ${round} of game ${game}!`);
        cards.push(a, b);
      } else {
        victor = player2;
        debug(`Player 2 wins round ${round} of game ${game}!`);
        cards.push(b, a);
      }
    }
    debug(`push(${cards.join(", ")})`);
    victor.push(...cards);
  }
  const scores = [player1, player2].map(score);
  if (scores[0] > scores[1]) {
    debug(`The winner of game ${game} is player 1!`);
  } else {
    debug(`The winner of game ${game} is player 2!`);
  }
  debug();
  return scores;
};

const part2 = ([player1, player2]) => {
  const scores = combat(1, [...player1], [...player2]);
  return Math.max(...scores);
};

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
