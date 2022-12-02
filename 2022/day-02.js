const KNOWN = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .map((line) => line.split(" "))
    .map(([them, me]) => [KNOWN[them], me]);
};

const BONUSES = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const outcome = (them, me) => {
  if (them === me) {
    return 3; // draw
  }

  if (
    (them === "rock" && me === "paper") ||
    (them === "paper" && me === "scissors") ||
    (them === "scissors" && me === "rock")
  ) {
    return 6; // I won
  }

  return 0; // I lost
};

const fight = (them, me) => {
  return BONUSES[me] + outcome(them, me);
};

const part1 = (rounds) => {
  const guide = {
    X: "rock",
    Y: "paper",
    Z: "scissors",
  };

  return rounds
    .map(([them, meCoded]) => [them, guide[meCoded]])
    .reduce((acc, [them, me]) => {
      return acc + fight(them, me);
    }, 0);
};

const part2 = (rounds) => {
  const instructions = {
    X: (them) => {
      switch (them) {
        case "rock":
          return "scissors";
        case "paper":
          return "rock";
        case "scissors":
          return "paper";
      }
    },
    Y: (them) => {
      return them;
    },
    Z: (them) => {
      switch (them) {
        case "rock":
          return "paper";
        case "paper":
          return "scissors";
        case "scissors":
          return "rock";
      }
    },
  };

  return rounds
    .map(([them, outcomeCoded]) => [them, instructions[outcomeCoded](them)])
    .reduce((acc, [them, me]) => {
      return acc + fight(them, me);
    }, 0);
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
