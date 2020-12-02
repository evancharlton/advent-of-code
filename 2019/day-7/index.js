const readLines = require("../read-input");
const intcode = require("../intcode");

const TEST =
  false &&
  "3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5";

const executeSequence = async (program, [a, b, c, d, e]) => {
  let outputs = {
    a: undefined,
    b: undefined,
    c: undefined,
    d: undefined,
    e: 0
  };

  const getInput = (amp, phaseSetting) => {
    let callCount = 0;
    return () => {
      if (callCount++ === 0) {
        return phaseSetting;
      }
      return new Promise(resolve => {
        (function getValue() {
          if (outputs[amp] !== undefined) {
            const output = outputs[amp];
            outputs[amp] = undefined;
            return resolve(output);
          }
          setTimeout(getValue, 1);
        })();
      });
    };
  };

  const setOutput = amp => output => {
    outputs[amp] = output;
  };

  const ampA = intcode(program, getInput("e", a), setOutput("a"));
  const ampB = intcode(program, getInput("a", b), setOutput("b"));
  const ampC = intcode(program, getInput("b", c), setOutput("c"));
  const ampD = intcode(program, getInput("c", d), setOutput("d"));
  const ampE = intcode(program, getInput("d", e), setOutput("e"));

  const memories = await Promise.all([ampA, ampB, ampC, ampD, ampE]);

  return outputs.e;
};

readLines("./day-7/input", TEST)
  .then(async ([program]) => {
    let maxOutput = 0;
    let sequence = "";
    const [min, max] = [5, 9];
    for (let a = min; a <= max; a += 1) {
      for (let b = min; b <= max; b += 1) {
        for (let c = min; c <= max; c += 1) {
          for (let d = min; d <= max; d += 1) {
            for (let e = min; e <= max; e += 1) {
              if (
                a === b ||
                a === c ||
                a === d ||
                a === e ||
                b === c ||
                b === d ||
                b === e ||
                c === d ||
                c === e ||
                d === e
              ) {
                continue;
              }
              const input = [a, b, c, d, e];
              const output = await executeSequence(program, input);
              if (output > maxOutput) {
                maxOutput = output;
                sequence = input.join(",");
              }
            }
          }
        }
      }
    }
    return { sequence, maxOutput };
  })
  .then(({ maxOutput }) => {
    return maxOutput;
  })
  .then(output => {
    if (output !== undefined) {
      if (Array.isArray(output) || typeof output === "object") {
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log(output);
      }
    }
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
