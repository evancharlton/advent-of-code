const data = (type = "") => {
  return require("./input")(__filename, "\n", type).map(Number);
};

const DIVISOR = 20201227;

const part1 = ([cardPublicKey, doorPublicKey]) => {
  let subjectNumber = 7;
  let value = 1;
  let i = 0;
  for (i = 1; true; i += 1) {
    if (i > 2_000_000) {
      console.error("Stopping after too many trials");
      throw new Error("Limit reached");
    }
    value *= subjectNumber;
    value %= DIVISOR;

    if (value === cardPublicKey) {
      break;
    }
  }

  const loops = i;
  value = 1;
  subjectNumber = doorPublicKey;
  for (i = 0; i < loops; i += 1) {
    value *= subjectNumber;
    value %= DIVISOR;
  }
  return value;
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
};
