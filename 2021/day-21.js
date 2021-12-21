const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .map((line) => {
      return line.replace(/^.+: /, "");
    })
    .map((v) => +v);
};

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

const part1 = ([one, two]) => {
  const scores = [0, 0];
  const positions = [one, two];
  let player = 0;
  while (Math.max(...scores) < 1000) {
    const rolls = roll() + roll() + roll();
    positions[player] += rolls;
    positions[player] %= 10;

    const pos = positions[player];
    scores[player] += pos === 0 ? 10 : pos;
    // console.log(
    //   `Player ${player} rolls ${rolls} and moves to space ${
    //     positions[player] === 0 ? 10 : positions[player] + 1
    //   } for a total score of ${scores[player]}`
    // );

    player += 1;
    player %= 2;
  }

  return Math.min(...scores) * _rolls;
};

const part2 = (data) => {
  return data;
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
