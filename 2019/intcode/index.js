const DEBUG = false;

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

const M = ["P", "I", "R"];

const execute = async (program, getInput, onOutput) => {
  const memory = program.split(",").map(v => +v);
  let i = 0;
  let relativeBase = 0;

  const getValue = (parameter, mode) => {
    let value = 0;
    if (mode === 2) {
      // Relative mode
      value = memory[parameter + relativeBase] || 0;
    } else if (mode === 1) {
      // Immediate mode
      value = parameter;
    } else {
      // Position mode
      value = memory[parameter] || 0;
    }
    return value || 0;
  };

  const setValue = (parameter, mode, value) => {
    let address = 0;
    switch (+mode) {
      case 2:
        // Relative mode
        address = parameter + relativeBase;
        break;
      case 1:
        // Immediate mode
        address = memory[parameter] || 0;
        break;
      case 0:
        // Position mode
        address = parameter;
        break;
      default:
        throw new Error(`Unknown mode: ${mode}`);
    }
    memory[address] = value;
  };

  while (true) {
    if (i >= memory.length) {
      throw new Error(`i (${i}) >= memory.length (${memory.length})`);
    }
    if (DEBUG) {
      console.log(memory.join(","));
      console.log(`\ti = ${i}\t\trelative_base = ${relativeBase}`);
    }

    const instruction = memory[i++];
    const { mode3, mode2, mode1, opcode } = processInstruction(instruction);
    if (DEBUG) {
      console.log(
        `\topcode = ${opcode}\tmodes: ${M[mode1]} ${M[mode2]} ${M[mode3]}`
      );
    }

    switch (+opcode) {
      // Add
      case 1: {
        const oneVal = getValue(memory[i++], mode1);
        const twoVal = getValue(memory[i++], mode2);
        const result = oneVal + twoVal;
        setValue(memory[i++], mode3, result);
        break;
      }
      // Multiply
      case 2: {
        const oneVal = getValue(memory[i++], mode1);
        const twoVal = getValue(memory[i++], mode2);
        const result = oneVal * twoVal;
        setValue(memory[i++], mode3, result);
        break;
      }
      // Input
      case 3: {
        const result = await getInput();
        setValue(memory[i++], mode1, result);
        break;
      }
      // Output
      case 4: {
        const output = getValue(memory[i++], mode1);
        onOutput(output);
        break;
      }
      // jump-if-true
      case 5: {
        const firstVal = getValue(memory[i++], mode1);
        const jumpTo = getValue(memory[i++], mode2);
        if (firstVal !== 0) {
          i = jumpTo;
        }
        break;
      }
      // jump-if-false
      case 6: {
        const firstVal = getValue(memory[i++], mode1);
        const jumpTo = getValue(memory[i++], mode2);
        if (firstVal === 0) {
          i = jumpTo;
        }
        break;
      }
      // less than
      case 7: {
        const firstVal = getValue(memory[i++], mode1);
        const secondVal = getValue(memory[i++], mode2);
        const result = firstVal < secondVal ? 1 : 0;
        setValue(memory[i++], mode3, result);
        break;
      }
      // equals
      case 8: {
        const firstVal = getValue(memory[i++], mode1);
        const secondVal = getValue(memory[i++], mode2);
        const result = firstVal === secondVal ? 1 : 0;
        setValue(memory[i++], mode3, result);
        break;
      }
      // adjust relative base
      case 9: {
        const adjustment = getValue(memory[i++], mode1);
        relativeBase += adjustment;
        break;
      }
      // Terminate
      case 99: {
        return memory;
      }
      default: {
        throw new Error(`Unknown opcode: ${opcode} (${i}, ${memory[i]})`);
      }
    }
  }
};

module.exports = execute;
