const fs = require("fs");
const readline = require("readline");

const getCodes = () => {
  return new Promise(resolve => {
    const codes = [];
    readline
      .createInterface({
        input: fs.createReadStream("./day-2/input")
      })
      .on("line", line => {
        line
          .split(",")
          .map(Number)
          .forEach(code => {
            codes.push(code);
          });
      })
      .on("close", () => {
        resolve(codes);
      });
  });
};

const run = (input, a, b) => {
  const codes = [...input];
  codes[1] = a;
  codes[2] = b;
  let i = 0;
  while (true) {
    const opcode = codes[i];
    const oneVal = codes[codes[i + 1]];
    const twoVal = codes[codes[i + 2]];
    const dest = codes[i + 3];
    switch (opcode) {
      case 1:
        codes[dest] = oneVal + twoVal;
        break;
      case 2:
        codes[dest] = oneVal * twoVal;
        break;
      case 99:
        return codes;
      default:
        throw new Error(`Unknown opcode: ${opcode}`);
    }
    i += 4;
  }
};

getCodes()
  .then(codes => {
    const copy = [...codes];
    for (let i = 0; i < copy.length; i += 1) {
      for (let j = 0; j < copy.length; j += 1) {
        const [output] = run(copy, i, j);
        if (output === 19690720) {
          return [i, j];
        }
      }
    }
    throw new Error("No solution");
  })
  .then(([noun, verb]) => {
    console.log(`noun=${noun} verb=${verb}\t${noun}${verb}`);
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
