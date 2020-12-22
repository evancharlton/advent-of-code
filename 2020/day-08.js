const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

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
      return accumulator;
    }

    if (visitedPointers.has(pointer)) {
      throw new Error(accumulator);
    }
    visitedPointers.add(pointer);

    const { ins, val } = parseLine(line);

    switch (ins) {
      case "nop": {
        pointer += 1;
        break;
      }

      case "jmp": {
        pointer += val;
        break;
      }

      case "acc": {
        accumulator += val;
        pointer += 1;
        break;
      }
    }
  }
};

const part1 = (lines) => {
  try {
    compute(lines);
  } catch (ex) {
    return +ex.message;
  }
};

const part2 = (lines) => {
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
      return compute(updated);
    } catch (e) {
      // Catch this and loop around -- this is expected because we're doing a
      // brute-force solution here.
    }
  }
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
