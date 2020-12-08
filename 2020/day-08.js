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
    if (!line) {
      console.log("PROGRAM TERMINATED");
      console.table({ pointer, accumulator });
      process.exit(0);
    }

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

for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];
  if (!(line.startsWith("jmp") || line.startsWith("nop"))) {
    continue;
  }

  const updated = [...lines];
  if (line.startsWith("jmp")) {
    updated[i] = line.replace("jmp", "nop");
  } else if (line.startsWith("nop")) {
    updated[i] = line.replace("nop", "jmp");
  }

  try {
    console.log("=====");
    compute(updated);
  } catch (e) {}
}
