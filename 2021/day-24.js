const data = (type = "") => {
  return require("./input")(__filename, "\n", type)
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"));
};

const pad = (s, l) => {
  let out = s;
  while (out.length < l) {
    out += " ";
  }
  return out;
};

let maxZ = 0;
const alu = (
  program,
  inputQueue,
  initialRegisters = { w: 0, x: 0, y: 0, z: 0 }
) => {
  let eip = 0;
  let ip = 0;
  const registers = {
    w: 0,
    x: 0,
    y: 0,
    z: 0,
    ...initialRegisters,
  };
  while (eip < program.length) {
    const ins = program[eip++];
    const [op, a, b] = ins.split(" ");
    const startRegisters = { ...registers };
    opSwitch: switch (op) {
      case "inp": {
        if (ip === inputQueue.length) {
          console.error(registers);
          throw new Error("No more inputs to give");
        }
        const inputValue = inputQueue[ip++];
        registers[a] = inputValue;
        break opSwitch;
      }
      case "add": {
        registers[a] += registers[b] ?? +b;
        break opSwitch;
      }
      case "mul": {
        registers[a] *= registers[b] ?? +b;
        break opSwitch;
      }
      case "div": {
        let res = (registers[a] ?? +a) / (registers[b] ?? +b);
        if (res > 0) {
          res = Math.floor(res);
        } else {
          res = Math.ceil(res);
        }
        registers[a] = res;
        break opSwitch;
      }
      case "mod": {
        // registers[a] += registers[b] ?? +b; // Avoid negative mods
        registers[a] %= registers[b] ?? +b;
        break opSwitch;
      }
      case "eql": {
        registers[a] = +(registers[a] ?? a) === +(registers[b] ?? b) ? 1 : 0;
        break opSwitch;
      }
      default:
        throw new Error(`Unknown instruction: ${ins}`);
    }
    if (JSON.stringify(startRegisters) !== JSON.stringify(registers)) {
      // console.log(`${pad(ins, 10)} =>`, registers);
    }
  }
  maxZ = Math.max(maxZ, registers.z);
  return registers;
};

const getSegments = (program) => {
  const out = [];
  const acc = [];
  for (let i = 0; i < program.length; i += 1) {
    const line = program[i];
    if (line.startsWith("inp")) {
      if (acc.length > 0) {
        out.push([...acc]);
      }
      acc.length = 0;
    }
    acc.push(line);
  }
  out.push([...acc]);
  return out;
};

const go = (segments, { zLimit, zTarget, inputs, i }) => {
  if (segments.length === 0) {
    const output = inputs.join("");
    console.log("Found a valid number:", output);
    return output;
  }
  const segment = segments.shift();

  const acc = [];
  wLoop: for (let w = 9; w >= 1; w -= 1) {
    zLooop: for (let z = 0; z < zLimit; z += 1) {
      const { z: out } = alu(segment, [w], { z });
      if (out === zTarget) {
        console.log(
          `alu(segments[${i}], [${w}], { z: ${z} }) yields the right registers`,
          `(input: ${inputs.join("")})`
        );
        console.log(`  => ${out}`);
        // We found a valid w + z combo that will yield the right z output.
        // Let's see if we can generate the right inputs.
        acc.push(
          go([...segments], {
            zLimit: Math.min(142443066, zLimit * 10),
            zTarget: z,
            inputs: [w, ...inputs],
            i: i + 1,
          })
        );
      }
    }
  }
  return acc.flat();
};

const part1 = (program) => {
  const segments = getSegments(program);
  const done = go(
    [...segments].reverse(),
    // [
    //   segments.pop(),
    //   segments.pop(),
    //   segments.pop(),
    //   segments.pop(),
    //   segments.pop(),
    //   // segments.pop()
    // ],
    {
      zLimit: 26,
      zTarget: 0,
      inputs: [],
      i: 0,
    }
  );
  return done.map((v) => +v).sort((a, b) => b - a);
};

const part1_2 = (program) => {
  const programSegments = getSegments(program);

  const limits = [260, 2600, 26000, 260000];
  let l = 0;

  let targetZ = new Set([0]);
  const options = new Array(programSegments.length);
  for (let i = programSegments.length - 1; i >= 0; i -= 1) {
    options[i] = new Set();
    const segment = programSegments.pop();
    const nextZTargets = new Set();
    const validPairs = [];
    wLoop: for (let w = 1; w <= 9; w += 1) {
      zLooop: for (let z = 0; z < limits[l]; z += 1) {
        const { z: out } = alu(segment, [w], { z });
        if (targetZ.has(out)) {
          // We found something that generated the right output.
          // This means that it's our target for the next input.
          nextZTargets.add(z);
          options[i].add(w);
          validPairs.push([w, z, out]);
        }
      }
    }
    l += 1;
    console.log(
      `For segment ${i}, the following states generated the desired outputs.`
    );
    console.log(`  desired z values: ${[...targetZ].join(" ")}`);
    const zMap = validPairs.reduce((acc, [w, z]) => {
      const next = { ...acc };
      next[w] = next[z] ?? new Set();
      next[w].add(z);
      return next;
    }, {});
    console.log(validPairs);
    const wValues = Object.keys(zMap)
      .map((v) => +v)
      .sort((a, b) => b - a);
    const highestW = wValues.shift();
    console.log(`  The highest W value is ${highestW}`);
    const zValues = zMap[highestW];
    console.log(`  .. and the Z values are`, zValues);
    targetZ = zValues;
  }

  return options;

  return alu(
    program,
    "99999999999997".split("").map((v) => +v)
  );
};

const part1_1 = (program) => {
  let digits = [];
  for (let a = 9; a >= 1; a -= 1) {
    for (let b = 9; b >= 1; b -= 1) {
      for (let c = 9; c >= 1; c -= 1) {
        for (let d = 9; d >= 1; d -= 1) {
          for (let e = 9; e >= 1; e -= 1) {
            for (let f = 9; f >= 1; f -= 1) {
              for (let g = 9; g >= 1; g -= 1) {
                for (let h = 9; h === 9; h -= 1) {
                  for (let i = 9; i === 9; i -= 1) {
                    for (let j = 9; j === 9; j -= 1) {
                      for (let k = 7; k === 7; k -= 1) {
                        for (let l = 9; l === 9; l -= 1) {
                          for (let m = 9; m === 9; m -= 1) {
                            for (let n = 4; n === 4; n -= 1) {
                              digits = [
                                a,
                                b,
                                c,
                                d,
                                e,
                                f,
                                g,
                                h,
                                i,
                                j,
                                k,
                                l,
                                m,
                                n,
                              ];
                              const registers = alu(program, digits);
                              const { z } = registers;
                              if (z === 0) {
                                return digits.join("");
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              console.log(digits.join(""));
            }
          }
        }
      }
    }
  }
  return "waht";
};

const part2 = (data) => {
  return data;
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(
    `Part 1:`,
    part1_1(
      data(process.argv[2] || ""),
      process.argv.slice(3).map((v) => +v)
    )
  );

  // console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  alu,
  part1,
  part2,
};
