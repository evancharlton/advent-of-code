const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const getNumDigits = (base10) => {
  let exp = 0;
  while (exp++ < 100) {
    const r = Math.pow(5, exp - 1);
    if (base10 <= 2 * r) {
      return exp;
    }
  }
};

const toSnafu = (base10) => {
  const numDigits = getNumDigits(base10);
  const digits = new Array(numDigits).fill("0");

  for (let i = 0; i < numDigits; i += 1) {
    const currentValue = fromSnafu(digits);
    const r = Math.pow(5, numDigits - 1 - i);
    const tailMax = fromSnafu(new Array(numDigits - 1 - i).fill("2"));
    const delta = base10 - currentValue;
    if (Math.abs(delta) <= tailMax) {
      // The tail can handle it
      digits[i] = "0";
    } else if (Math.abs(delta) <= r + tailMax) {
      if (delta < 0) {
        digits[i] = "-";
      } else {
        digits[i] = "1";
      }
    } else if (Math.abs(delta) > r + tailMax) {
      if (delta < 0) {
        digits[i] = "=";
      } else {
        digits[i] = "2";
      }
    }
  }

  return digits.join("");
};

const fromSnafu = (snafu) => {
  const spots = Array.isArray(snafu) ? snafu : snafu.split("");
  return spots.reduce((acc, c, i, arr) => {
    const power = arr.length - 1 - i;
    switch (c) {
      case "-":
        return acc + -1 * Math.pow(5, power);
      case "=":
        return acc + -2 * Math.pow(5, power);
      case "0":
        return acc;
      case "1":
        return acc + Math.pow(5, power);
      case "2":
        return acc + 2 * Math.pow(5, power);
      default:
        throw new Error(`Unexpected input: ${c}`);
    }
  }, 0);
};

const part1 = (snafus) => {
  return toSnafu(snafus.map(fromSnafu).reduce((acc, v) => acc + v, 0));
};

const part2 = () => {
  return undefined;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  getNumDigits,
  part1,
  part2,
  toSnafu,
  fromSnafu,
};
