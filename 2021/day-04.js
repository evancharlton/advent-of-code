const data = (type = "") => {
  const [numbers, ...boardsLines] = require("./input")(__filename, "\n", type);
  const boards = [];
  for (let i = 0; i < boardsLines.length; i += 6) {
    const [_space, first, second, third, fourth, fifth] = [
      boardsLines[i + 0],
      boardsLines[i + 1],
      boardsLines[i + 2],
      boardsLines[i + 3],
      boardsLines[i + 4],
      boardsLines[i + 5],
    ];
    boards.push(
      [first, second, third, fourth, fifth]
        .map((line) => line.trim())
        .map((line) =>
          line
            .split(" ")
            .filter((num) => num !== "")
            .map((n) => +n)
        )
    );
  }
  return { numbers: numbers.split(",").map((n) => +n), boards };
};

const isBingo = (board, drawnNumbers) => {
  const checker = [
    new Array(5).fill(false),
    new Array(5).fill(false),
    new Array(5).fill(false),
    new Array(5).fill(false),
    new Array(5).fill(false),
  ];

  const flatBoard = board.flat();
  drawnNumbers.forEach((num) => {
    const index = flatBoard.indexOf(num);
    if (index < 0) {
      return;
    }

    const rowIndex = Math.floor(index / board[0].length);
    const colIndex = index % board[0].length;
    checker[rowIndex][colIndex] = true;
  });

  // Check rows
  for (let y = 0; y < board.length; y += 1) {
    if (checker[y].every((v) => !!v)) {
      return { results: checker };
    }
  }

  // Check columns
  for (let x = 0; x < board[0].length; x += 1) {
    const values = [];
    for (let y = 0; y < board.length; y += 1) {
      values.push(checker[y][x]);
    }
    if (values.every(Boolean)) {
      return { results: checker };
    }
  }

  return false;
};

const scoreWinner = (board, drawnNumbers) => {
  const bingoOutput = isBingo(board, drawnNumbers);
  if (!bingoOutput) {
    return 0;
  }

  const { results } = bingoOutput;

  const flatBoard = board.flat();
  const flatChecks = results.flat();
  return (
    flatBoard
      .map((v, i) => {
        if (flatChecks[i]) {
          return 0;
        }
        return v;
      })
      .reduce((acc, v) => acc + v) * drawnNumbers[drawnNumbers.length - 1]
  );
};

const part1 = ({ numbers, boards }) => {
  // Play until we find bingo
  for (let i = 0; i < numbers.length; i += 1) {
    for (let j = 0; j < boards.length; j += 1) {
      const score = scoreWinner(boards[j], numbers.slice(0, i));
      if (score > 0) {
        return score;
      }
    }
  }
  return -1;
};

const part2 = ({ numbers, boards }) => {
  const exits = new Array(boards.length).fill(-1);
  for (let i = 0; i < numbers.length; i += 1) {
    const draws = numbers.slice(0, i);
    for (let j = 0; j < boards.length; j += 1) {
      if (exits[j] !== -1) {
        // This player is already out.
        continue;
      }

      const score = scoreWinner(boards[j], draws);

      if (score > 0) {
        exits[j] = i;
      }
    }
  }
  const highestIndex = exits.reduce((acc, turn, i) => {
    if (exits[acc] < turn) {
      return i;
    }
    return acc;
  }, 0);

  return scoreWinner(
    boards[highestIndex],
    numbers.slice(0, exits[highestIndex])
  );
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
