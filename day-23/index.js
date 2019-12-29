const readLines = require("../read-input");
const intcode = require("../intcode");

readLines("./day-23/input")
  .then(async ([program]) => {
    const queues = [];

    let lastY = undefined;

    let NAT = undefined;

    const handleInput = id => {
      let providedId = false;
      return () => {
        try {
          if (!providedId) {
            providedId = true;
            return id;
          }

          if (queues[id].length === 0) {
            return -1;
          }
          // const letter = queues[id].length % 2 ? "Y" : "X";
          const value = queues[id].shift();
          // console.log(`${id} <-- ${letter}=${value}`);
          return value;
        } finally {
          // A packet was just sent; is the network idle now?
          if (
            NAT &&
            queues.every(queue => {
              return queue.length === 0;
            })
          ) {
            const { x, y } = NAT;
            if (lastY === y) {
              console.warn(y);
            }
            lastY = y;
            console.log(`NAT => 0 X=${x} Y=${y}`);
            queues[0].push(x, y);
            NAT = undefined;
          }
        }
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
        // console.log(`${id} --> ${recipient}  X=${x} Y=${y}`);
        if (recipient === 255) {
          // console.log(`${id} --> NAT  X=${x} Y=${y}`);
          // This is the NAT.
          NAT = { x, y };
        } else {
          queues[recipient].push(x, y);
        }
        recipient = undefined;
        x = undefined;
        y = undefined;
      };
    };

    const computers = [];
    for (let i = 0; i < 50; i += 1) {
      queues.push([]);
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
