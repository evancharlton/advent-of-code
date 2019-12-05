const readLines = require("../read-input");

const processInstruction = ins => {
  const s = String(ins);
  let mode1 = 0;
  let mode2 = 0;
  let mode3 = 0;
  let opcode = "00";
  if (s.length === 1) {
    opcode = +s;
  } else if (s.length === 2) {
    opcode = +s;
  } else if (s.length === 3) {
    const [m1, ...op] = s;
    opcode = +op.join("");
    mode1 = +m1;
  } else if (s.length === 4) {
    const [m2, m1, ...op] = s;
    opcode = +op.join("");
    mode1 = +m1;
    mode2 = +m2;
  } else if (s.length === 5) {
    const [m3, m2, m1, ...op] = s;
    opcode = +op.join("");
    mode1 = +m1;
    mode2 = +m2;
    mode3 = +m3;
  } else {
    throw new Error(`${s} isn't the right length`);
  }
  return {
    mode1,
    mode2,
    mode3,
    opcode
  };
};

const getValue = (codes, parameter, mode) => {
  if (+mode === 1) {
    // Immediate mode
    return parameter;
  } else {
    // Position mode
    return codes[parameter];
  }
};

const execute = input => {
  return readLines("./day-5/input")
    .then(([line]) => {
      return line.split(",").map(Number);
    })
    .then(codes => {
      const copy = [...codes];
      let i = 0;
      let finalOutput = 0;
      while (true) {
        if (i >= codes.length) {
          throw new Error(`i (${i}) >= codes.length (${codes.length})`);
        }
        const instruction = codes[i];
        const { mode3, mode2, mode1, opcode } = processInstruction(instruction);
        switch (+opcode) {
          case 1: {
            const oneVal = getValue(codes, codes[++i], mode1);
            const twoVal = getValue(codes, codes[++i], mode2);
            const result = oneVal + twoVal;
            codes[codes[++i]] = result;
            break;
          }
          case 2: {
            const oneVal = getValue(codes, codes[++i], mode1);
            const twoVal = getValue(codes, codes[++i], mode2);
            const result = oneVal * twoVal;
            codes[codes[++i]] = result;
            break;
          }
          case 3: {
            // Where to store the input
            const inputLocation = codes[++i];
            codes[inputLocation] = input;
            break;
          }
          case 4: {
            const output = codes[+codes[++i]];
            finalOutput = output;
            break;
          }
          case 99: {
            return finalOutput;
          }
          default: {
            throw new Error(`Unknown opcode: ${opcode} (${i}, ${codes[i]})`);
          }
        }
        i += 1;
      }
    });
};

execute(1)
  .then(diagnosticCode => {
    console.log(diagnosticCode);
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
