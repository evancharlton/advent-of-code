const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .map((line) => {
      return line.replace(/^.+: /, "");
    })
    .map((v) => +v);
};

const part1 = ([one, two]) => {
  let _dice = 0;
  let _rolls = 0;
  const roll = () => {
    _dice = _dice + 1;
    if (_dice > 100) {
      _dice = 1;
    }
    _rolls += 1;
    return _dice;
  };

  const play = (roll) => {
    return (roll() + roll() + roll()) % 10;
  };

  const scores = [0, 0];
  const positions = [one, two];
  let player = 0;
  while (Math.max(...scores) < 1000) {
    const rolls = play(roll);
    positions[player] += rolls;
    positions[player] %= 10;

    const pos = positions[player];
    scores[player] += pos === 0 ? 10 : pos;

    player += 1;
    player %= 2;
  }

  return Math.min(...scores) * _rolls;
};

const knownOutcomes = new Map();
const getCacheKey = ([p1, s1], [p2, s2]) => {
  return `${p1} ${s1} || ${p2} ${s2}`;
};

const ROLL_SEQUENCES = (() => {
  const out = [];
  for (let a = 1; a <= 3; a += 1) {
    for (let b = 1; b <= 3; b += 1) {
      for (let c = 1; c <= 3; c += 1) {
        out.push([a + b + c, a, b, c]);
      }
    }
  }
  return out;
})();

const play = (me, them) => {
  const cacheKey = getCacheKey(me, them);
  if (knownOutcomes.has(cacheKey)) {
    return knownOutcomes.get(cacheKey);
  }

  const [myPos, myScore] = me;
  const [theirPos, theirScore] = them;

  if (myScore >= 21) {
    return [1, 0];
  }

  if (theirScore >= 21) {
    return [0, 1];
  }

  const victories = [0, 0];
  ROLL_SEQUENCES.forEach(([sum]) => {
    const nextPosition = (myPos + sum) % 10;
    const nextScore = myScore + nextPosition + 1;
    const [theirWins, myWins] = play(
      [theirPos, theirScore],
      [nextPosition, nextScore]
    );
    victories[0] += myWins;
    victories[1] += theirWins;
  });

  knownOutcomes.set(cacheKey, victories);
  return victories;
};

const part2 = ([p1, p2]) => {
  return Math.max(...play([p1 - 1, 0], [p2 - 1, 0]));
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
