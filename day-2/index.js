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

getCodes()
  .then(codes => {
    const copy = [...codes];
    copy[1] = 12;
    copy[2] = 2;
    return copy;
  })
  .then(c => {
    const codes = [...c];
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
  })
  .then(out => {
    console.log(out);
  });
