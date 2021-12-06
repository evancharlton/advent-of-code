const readLines = require("../read-input");
const intcode = require("../intcode");

readLines(`${__dirname}/input`)
  .then(async ([robot]) => {
    const script = await readLines(`${__dirname}/spring`);
    script.push("RUN");
    return [robot, script];
  })
  .then(async ([robot, script]) => {
    let out = [];
    try {
      const instructions = script.join("\n");
      let instructionPointer = 0;

      let result = 0;
      await intcode(
        robot,
        () => {
          const input = instructions[instructionPointer++] ?? "\n";
          out.push(input);
          return input.charCodeAt(0);
        },
        (output) => {
          if (output > 256) {
            result = output;
          } else {
            out.push(String.fromCharCode(output));
          }
        }
      );
      return result;
    } finally {
      console.log(out.join(""));
    }
  })
  .then((output) => {
    if (output !== undefined) {
      if (Array.isArray(output) || typeof output === "object") {
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log(output);
      }
    }
    process.exit(0);
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });
