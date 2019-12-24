const readLines = require("../read-input");
const intcode = require("../intcode");

const TEST = "";

const INPUTS = [
  // main input
  "A,B,B,C,B,C,B,C,A,A",
  // A program
  "L,6,R,8,L,4,R,8,L,12",
  // B program
  "L,12,R,10,L,4",
  // C program
  "L,12,L,6,L,4,L,4",
  // Video feed?
  "y"
].reduce((acc, routine, i) => {
  return [
    ...acc,
    ...routine.split("").map(v => String(v).charCodeAt(0)),
    "\n".charCodeAt(0)
  ];
}, []);

readLines("./day-17/input", TEST)
  .then(async ([program]) => {
    return `2${program.substr(1)}`;
  })
  .then(async program => {
    const outputs = [];
    await intcode(
      program,
      () => {
        const input = INPUTS.shift();
        // console.log(
        //   `Sending ${input} (${
        //     input === 10 ? "\\n" : String.fromCharCode(input)
        //   })`
        // );
        return input;
      },
      out => {
        if (out > 200) {
          console.log(out);
        } else {
          outputs.push(out);
        }
      }
    );
    return outputs.map(v => String.fromCharCode(+v));
  })
  .then(chars => {
    return ` ${chars.join(" ")}`;
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
