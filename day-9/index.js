const readLines = require("../read-input");
const intcode = require("../intcode");

const TEST = false;

readLines("./day-9/input", TEST)
  .then(async ([program]) => {
    const outputs = [];
    return intcode(
      program,
      () => 1,
      output => {
        outputs.push(output);
      }
    ).then(memory => {
      console.log("=>", memory.join(","));
      outputs.reverse();
      const [boost, ...rest] = outputs;
      rest.reverse();
      return { boost, errors: rest };
    });
  })
  .then(({ boost, errors }) => {
    if (errors.length > 0) {
      console.error(`Bad instructions: ${errors.join(" ")}`);
    } else {
      console.log("BOOST code:", boost);
    }
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
