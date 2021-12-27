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

const ogDebug = console.debug;
console.debug = process.argv.includes("--debug")
  ? (...args) => {
      ogDebug(...args);
    }
  : () => undefined;

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
    // if (JSON.stringify(startRegisters) !== JSON.stringify(registers)) {
    if (ins.startsWith("inp")) {
      console.debug("");
    }
    console.debug(`${pad(ins, 10)} =>`, registers);
    // }
  }
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
  console.log(
    `go(segments[${i}], { zLimit: ${zLimit}, zTarget: ${zTarget}, inputs: [${inputs.join(
      ", "
    )}] })`
  );
  if (segments.length === 0) {
    const output = inputs.join("");
    console.log("Found a valid number:", output);
    return output;
  }
  const segment = segments.shift();

  const acc = [];
  wLoop: for (let w = 1; w <= 9; w += 1) {
    console.log(`  => w = ${w}`);
    zLoop: for (let z = 0; z < zLimit; z += 1) {
      const { z: out } = alu(segment, [w], { z });
      if (out === zTarget) {
        console.log(
          `  alu(segments[${i}], [${w}], { z: ${z} }) yields the right registers`,
          `(input: ${w}${inputs.join("")})`
        );
        console.log(`    => ${out}`);
        // We found a valid w + z combo that will yield the right z output.
        // Let's see if we can generate the right inputs.
        acc.push(
          go([...segments], {
            zLimit: Math.min(2600000, zLimit * 10),
            zTarget: z,
            inputs: [w, ...inputs],
            i: i + 1,
          })
        );
        break zLoop;
      }
    }
  }
  return acc.flat();
};

const go2 =
  (program) =>
  (segments, { zLimit, zTarget, inputs, i }, recurse) => {
    const bounds = [0, zLimit];
    console.log(
      `go2(program@${i}, { zLimit: ${zLimit}, zTarget: ${zTarget}, inputs: [${inputs.join(
        ", "
      )}] })`
    );
    if (i >= 5) {
      console.log(`Hit the depth limit; stopping after ${inputs.join("")}`);
      return;
    }
    if (segments.length === 0) {
      const output = inputs.join("");
      const { z: sanity } = alu(
        program,
        inputs.map((v) => +v)
      );
      console.log("Found a valid number:", output);
      console.log(`  This input yields: z=${sanity}`);
      return;
    }
    const [segment, ...rest] = segments;

    const acc = [];
    zLoop: for (let z = bounds[0]; z <= bounds[1]; z += 1) {
      if (z && z % 100_000 === 0) {
        console.log(`Checking z: ${z} ... @ ${i}`);
      }
      wLoop: for (let w = 1; w <= 9; w += 1) {
        const { z: out } = alu(segment, [w], { z });
        // console.log(`alu(segments[${i}], [${w}], { z: ${z} }) => ${out}`);
        if (out === zTarget) {
          // Recurse!
          recurse(
            rest,
            {
              zLimit: zLimit * 25,
              zTarget: z,
              inputs: [w, ...inputs],
              i: i + 1,
            },
            recurse
          );
          if (w === 9) {
            console.log(
              `Found a match for w=9 @ ${i}; not checking any more z values`
            );
            break zLoop;
          }
        }
      }
    }
    console.warn(
      `Didn't find any valid inputs for z:[${-zLimit},${zLimit}] for zTarget: ${zTarget} @ ${i}`
    );
    return;
  };

const go3 = (segments, { step, zTarget, inputs }) => {
  const [zMin, zMax] = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(
    ([zMin, zMax], w) => {
      const program = segments.slice(0, segments.length - step).flat();
      const { z } = alu(program, [w, w, w, w, w, w, w, w, w, w, w, w, w, w]);
      return [Math.min(z, zMin), Math.max(z, zMax)];
    },
    [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
  );

  return [zMin, zMax];
};

const part1 = (program) => {
  return alu(
    program,
    "98491959997994".split("").map((v) => +v)
  );

  const segments = getSegments(program);

  const fn = (() => {
    switch (process.env.GO_FUNC) {
      case "1":
        return go;
      case "2":
        return go2(program);
      case "3":
        return () => {
          return go3(segments, { step: 1, zTarget: 0, inputs: [] });
        };
      default:
        throw new Error("Unknown gofunc");
    }
  })();
  const done =
    fn(
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
      },
      fn
    ) ?? [];
  return done.map((v) => +v).sort((a, b) => b - a);
};

const part1_1 = (program, start) => {
  let digits = [];
  // prettier-ignore
  for (let a = 6; a <= 9; a += 1) { // w0
    for (let b = 1; b <= 9; b += 1) { // w1
      for (let c = 1; c <= 9; c += 1) { // w2
        for (let d = 9; d <= 9; d += 1) { // w3 - known
          for (let e = 1; e <= 1; e += 1) { // w4 -  known
            for (let f = 1 + 4; f <= 9; f += 1) { // w5
              for (let g = f - 4; g <= 9; g += 1) { // w6 - must be w5 - 4
                for (let h = c + 5; h <= 9; h += 1) { // w7
                  for (let i = 1; i <= 9; i += 1) { // w8
                    /*for (let j = 1; j <= 9; j += 1)*/ const j = i; { // w9 - must == w8
                      for (let k = 1; k <= 9 - 2; k += 1) { // w10
                        for (let l = k + 2; l <= 9; l += 1) { // w11
                          for (let m = b + 1; m <= 9; m += 1) { // w12
                            for (let n = a - 5; n <= 9; n += 1) { // w13
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
                              if (digits.length !== 14) {
                                throw new Error(
                                  `wrong number of digits ${digits.length} != 14`
                                );
                              }
                              const registers = alu(program, digits);
                              const { z } = registers;
                              if (z === 0) {
                                return digits.join("");
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
        }
      }
    }
  }
};

const part2 = (data) => {
  return data;
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  const fn = process.env.OPERATION === "brute" ? part1_1 : part1;
  console.log(`Part 1:`, fn(data(process.argv[2] || ""), process.argv[3]));

  // console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  alu,
  part1,
  part2,
};
