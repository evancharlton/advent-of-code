const readLines = require("../read-input");
const intcode = require("../intcode");

readLines("./day-23/input")
  .then(async ([program]) => {
    const queues = {};

    const handleInput = id => {
      let providedId = false;
      return () => {
        if (!providedId) {
          providedId = true;
          return id;
        }

        if (queues[id].length === 0) {
          return -1;
        }
        const letter = queues[id].length % 2 ? "Y" : "X";
        const value = queues[id].shift();
        console.log(`${id} <-- ${letter}=${value}`);
        return value;
      };
    };

    const handleOutput = id => {
      let recipient = undefined;
      let x = undefined;
      let y = undefined;
      return output => {
        if (recipient === undefined) {
          recipient = output;
          return;
        }
        if (x === undefined) {
          x = output;
          return;
        }
        if (y === undefined) {
          y = output;
        }
        if (!queues[recipient]) {
          queues[recipient] = [];
          console.warn(`${id} --> ${recipient}  X=${x} Y=${y}`);
        } else {
          console.log(`${id} --> ${recipient}  X=${x} Y=${y}`);
        }
        queues[recipient].push(x);
        queues[recipient].push(y);
        if (recipient === 255) {
          console.log("255: ", y);
        }
        recipient = undefined;
        x = undefined;
        y = undefined;
      };
    };

    const computers = [];
    for (let i = 0; i < 50; i += 1) {
      queues[i] = [];
      computers.push(intcode(program, handleInput(i), handleOutput(i)));
    }
    await Promise.all(computers);
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
