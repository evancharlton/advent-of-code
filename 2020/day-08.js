const lines = require("./input")(__filename);

const parseLine = (line) => {
  const [ins, v] = line.split(" ");
  let val = v;
  if (val.startsWith("+")) {
    val = val.replace("+", "");
  }
  return {
    ins,
    val: +val,
  };
};

const compute = (program) => {
  let accumulator = 0;
  let pointer = 0;
  const visitedPointers = new Set();

  while (true) {
    const line = program[pointer];
    console.log(`PROG[${pointer}]: ${line}\t\t// ${accumulator}`);

    if (visitedPointers.has(pointer)) {
      throw new Error(`We have been to ${pointer} before`);
    }
    visitedPointers.add(pointer);

    const { ins, val } = parseLine(line);

    switch (ins) {
      case "nop": {
        pointer += 1;
        break;
      }

      case "jmp": {
        console.log(`  jump ${val} from ${pointer} to ${pointer + val}`);
        pointer += val;
        break;
      }

      case "acc": {
        console.log(
          `  add ${val} to ${accumulator} to give ${accumulator + val}`
        );
        accumulator += val;
        pointer += 1;
        break;
      }

      default: {
        console.error(`Unrecognized instruction: ${ins}`);
        console.error(`---> ${line}`);
        throw new Error("");
      }
    }

    console.log("----");
  }
};

compute(lines);
