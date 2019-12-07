const readLines = require("../read-input");
const intcode = require("../intcode");

const TEST = false;

const createRunner = program => {
  return (phase, previousOutput) => {
    let inputCount = 0;
    let output = 0;
    intcode(
      program,
      () => {
        if (inputCount++ === 0) {
          return phase;
        }
        return previousOutput;
      },
      out => {
        output = out;
      }
    );
    return output;
  };
};

const executeSequence = (runner, [A, B, C, D, E]) => {
  const outputA = runner(A, 0);
  const outputB = runner(B, outputA);
  const outputC = runner(C, outputB);
  const outputD = runner(D, outputC);
  const outputE = runner(E, outputD);
  const log = (letter, phase, output) => `${letter}(${phase}, ${output})`;
  // console.log(
  //   [
  //     log("A", A, 0),
  //     log("B", B, outputA),
  //     log("C", C, outputB),
  //     log("D", D, outputC),
  //     log("E", E, outputD)
  //   ].join(" => "),
  //   "=>",
  //   outputE
  // );
  return outputE;
};

readLines("./day-7/input", TEST)
  .then(([program]) => {
    const runner = createRunner(program);
    return runner;
  })
  .then(runner => {
    let maxOutput = 0;
    let sequence = "";
    for (let a = 0; a <= 4; a += 1) {
      for (let b = 0; b <= 4; b += 1) {
        for (let c = 0; c <= 4; c += 1) {
          for (let d = 0; d <= 4; d += 1) {
            for (let e = 0; e <= 4; e += 1) {
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
              const output = executeSequence(runner, input);
              // console.log(input.join(","), "=>", output);
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
