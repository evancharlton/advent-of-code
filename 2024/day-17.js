const data = (type = "") => {
  const [registers, program] = require("./input")(__filename, { type, trim: true, delim: "\n\n" });
  return {
    registers: registers.split("\n").map(line => {
      const [_, id, value] = line.match(/^Register ([^:]+): (.+)$/)
      return [id, value]
    }).reduce((acc, [id, value]) => ({
      ...acc,
      [id]: +value
    }), {}),
    program: program.replace("Program: ", "").split(",").map(v => +v)
  };
};

const computer = (initialRegisters) => {
  const registers = { ...initialRegisters }

  const combo = (v) => {
    switch (v) {
      case 0:
      case 1:
      case 2:
      case 3: {
        return v;
      }
      case 4: return registers.A;
      case 5: return registers.B;
      case 6: return registers.C;
      case 7: {
        throw new Error("Illegal combo operand")
      }
    }
  }

  return (program, output) => {
    let pointer = 0;
    while (pointer < program.length) {
      const operand = program[pointer + 1]
      switch (program[pointer]) {
        case 0: // adv - divide
          {
            const numerator = registers.A;
            const denominator = Math.pow(2, combo(operand));
            const result = Math.floor(numerator / denominator);
            registers.A = result;
            pointer += 2;
            break;
          }

        case 1: // bxl - B xor literal
          {
            registers.B = registers.B ^ operand
            pointer += 2;
            break;
          }

        case 2: // bst - mod 8
          {
            registers.B = combo(operand) % 8;
            pointer += 2;
            break;
          }

        case 3: // jnz - jump
          {
            if (registers.A === 0) {
              pointer += 2;
            } else {
              pointer = operand;
            }
            break;
          }

        case 4: // bxc - B xor C
          {
            registers.B = registers.B ^ registers.C
            pointer += 2;
            break;
          }

        case 5: // out - output a result
          {
            const input = output(combo(operand) % 8)
            if (input === false) {
              pointer += program.length
              break;
            }
            pointer += 2;
            break;
          }

        case 6: // bdv - divide
          {
            const numerator = registers.A;
            const denominator = Math.pow(2, combo(operand));
            const result = Math.floor(numerator / denominator);
            registers.B = result;
            pointer += 2;
            break;
          }
        case 7: // cdv - divide
          {
            const numerator = registers.A;
            const denominator = Math.pow(2, combo(operand));
            const result = Math.floor(numerator / denominator);
            registers.C = result;
            pointer += 2;
            break;
          }

        default: {
          throw new Error("Illegal operation")
        }
      }
    }
  }
}

const part1 = ({ registers, program }) => {
  const comp = computer(registers);

  const res = [];
  const output = (v) => res.push(v);
  comp(program, output)

  return res.join(',')
};

const part2 = ({ registers, program }) => {
  return { registers, program }
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
