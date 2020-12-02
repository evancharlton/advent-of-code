const readLines = require("../read-input");
const intcode = require("../intcode");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

readLines("./day-25/input")
  .then(async ([program]) => {
    let output = "";
    let input = [];
    rl.on("line", i => {
      console.log(` ==> ${i}`);
      input = i.split("").map(c => c.charCodeAt(0));
      input.push(10);
    });
    await intcode(
      program,
      () => {
        return new Promise(resolve => {
          (function getValue() {
            if (input.length > 0) {
              const c = input.shift();
              return resolve(c);
            }
            setTimeout(getValue, 1);
          })();
        });
      },
      out => {
        const c = String.fromCharCode(out);
        output += c;
        if (c === "\n") {
          console.log(output.trim());
          output = "";
        }
      }
    );
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
