const readLines = require("../read-input");

const TEST = [12345678, "80871224585914546619083218645595"];

const createPatterns = (base, length) => {
  const patterns = [];
  for (let p = 0; p < length; p += 1) {
    const output = [];
    const repeats = p + 1;
    for (let i = 0; i < length + 1; i += 1) {
      const value = base[i % base.length];
      for (let r = 0; r < repeats; r += 1) {
        output.push(value);
        if (output.length >= length + 1) {
          break;
        }
      }
      if (output.length >= length + 1) {
        break;
      }
    }
    patterns.push(output.slice(1, length + 1));
  }
  return patterns;
};

const applyPattern = (input, pattern) => {
  if (input.length !== pattern.length) {
    throw new Error("Mismatched lengths");
  }
  let sum = 0;
  for (let i = 0; i < input.length; i += 1) {
    sum += (input[i] * pattern[i]) % 10;
  }
  return Math.abs(sum) % 10;
};

const testCase = process.argv.length === 3 ? +process.argv[2] : -1;

readLines("./day-16/input", TEST[testCase])
  .then(([data]) => {
    return String(data)
      .split("")
      .map(v => +v);
  })
  .then(numbers => {
    let input = [...numbers];
    let iterations = 0;
    const length = input.length;
    const patterns = createPatterns([0, 1, 0, -1], input.length);
    do {
      const newValues = [];
      for (let i = 0; i < length; i += 1) {
        const pattern = patterns[i];
        const value = applyPattern(input, pattern);
        if (Number.isNaN(value)) {
          throw new Error("NaN");
        }
        newValues.push(value);
      }
      input = [...newValues];
      iterations += 1;
    } while (iterations < 100);
    return input;
  })
  .then(output => {
    return output.slice(0, 8);
  })
  .then(output => {
    return output.join("");
  })
  .then(output => {
    if (output !== undefined) {
      if (Array.isArray(output) || typeof output === "object") {
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log(output);
      }
    }
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
