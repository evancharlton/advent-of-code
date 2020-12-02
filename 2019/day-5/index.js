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
    return +parameter;
  } else {
    // Position mode
    return +codes[parameter];
  }
};

const execute = (input, sample) => {
  return readLines("./day-5/input", sample)
    .then(([line]) => {
      return line.split(",").map(Number);
    })
    .then(codes => {
      let i = 0;
      let finalOutput = 0;
      while (true) {
        if (i >= codes.length) {
          throw new Error(`i (${i}) >= codes.length (${codes.length})`);
        }
        const instruction = codes[i++];
        const { mode3, mode2, mode1, opcode } = processInstruction(instruction);
        switch (+opcode) {
          // Add
          case 1: {
            const oneVal = getValue(codes, codes[i++], mode1);
            const twoVal = getValue(codes, codes[i++], mode2);
            const result = oneVal + twoVal;
            codes[codes[i++]] = result;
            break;
          }
          // Multiply
          case 2: {
            const oneVal = getValue(codes, codes[i++], mode1);
            const twoVal = getValue(codes, codes[i++], mode2);
            const result = oneVal * twoVal;
            codes[codes[i++]] = result;
            break;
          }
          // Input
          case 3: {
            const inputLocation = codes[i++];
            codes[inputLocation] = input;
            break;
          }
          // Output
          case 4: {
            const output = getValue(codes, codes[i++], mode1);
            finalOutput = output;
            break;
          }
          // jump-if-true
          case 5: {
            const firstVal = getValue(codes, codes[i++], mode1);
            const jumpTo = getValue(codes, codes[i++], mode2);
            if (firstVal !== 0) {
              i = jumpTo;
            }
            break;
          }
          // jump-if-false
          case 6: {
            const firstVal = getValue(codes, codes[i++], mode1);
            const jumpTo = getValue(codes, codes[i++], mode2);
            if (firstVal === 0) {
              i = jumpTo;
            }
            break;
          }
          // less than
          case 7: {
            const firstVal = getValue(codes, codes[i++], mode1);
            const secondVal = getValue(codes, codes[i++], mode2);
            const thirdVal = getValue(codes, codes[i++], 1);
            codes[thirdVal] = firstVal < secondVal ? 1 : 0;
            break;
          }
          // equals
          case 8: {
            const firstVal = getValue(codes, codes[i++], mode1);
            const secondVal = getValue(codes, codes[i++], mode2);
            const thirdVal = getValue(codes, codes[i++], 1);
            codes[thirdVal] = firstVal === secondVal ? 1 : 0;
            break;
          }
          // Terminate
          case 99: {
            return finalOutput;
          }
          default: {
            throw new Error(`Unknown opcode: ${opcode} (${i}, ${codes[i]})`);
          }
        }
      }
    });
};

execute(5)
  .then(diagnosticCode => {
    console.log(diagnosticCode);
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
